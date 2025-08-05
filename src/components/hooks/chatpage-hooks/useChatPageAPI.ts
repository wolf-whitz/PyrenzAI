import { useState } from 'react';
import { useGenerateMessage } from '@components';
import { useChatStore } from '~/store';
import { Message, User, Character } from '@shared-types';
import { Utils } from '~/Utility';

interface ImageGenerationResponse {
  data: {
    created: number;
    model: string;
    data: Array<{
      url: string;
    }>;
  };
}

interface ChatPageAPI {
  isSettingsOpen: boolean;
  isAdModalOpen: boolean;
  setIsAdModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSettings: () => void;
  handleSend: (message: string) => Promise<void>;
  handleRemoveMessage: (messageId: string) => Promise<void>;
  handleRegenerateMessage: (messageId: string) => Promise<void>;
  handleEditMessage: (
    messageId: string,
    editedMessage: string,
    type: 'user' | 'char'
  ) => Promise<void>;
  onGenerateImage: (messageId: string) => Promise<void>;
}

export const useChatPageAPI = (
  previous_message: Message[],
  user: User,
  char: Character,
  chat_uuid: string,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  onEmotionDetected?: (emotion: string) => void
): ChatPageAPI => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const generateMessage = useGenerateMessage();
  const { setMessages } = useChatStore();

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const handleSend = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    try {
      const response = await generateMessage(
        trimmed,
        user,
        char,
        chat_uuid,
        setMessages,
        setIsGenerating,
        'Generate'
      );

      if (response?.emotion_type && onEmotionDetected) {
        onEmotionDetected(response.emotion_type);
      }

      if (!response.isSubscribed && response.remainingMessages === 0) {
        setIsAdModalOpen(true);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleRemoveMessage = async (messageId: string) => {
    if (!messageId) return;

    const index = previous_message.findIndex((msg) => msg.id === messageId);
    if (index === -1) return;

    const ids = previous_message
      .slice(index)
      .map((msg) => msg.id)
      .filter((id): id is string => !!id);

    if (!ids.length) return;

    try {
      await Utils.db.remove({
        tables: 'chat_messages',
        match: { id: ids },
      });

      setMessages((prev) => prev.filter((msg) => !ids.includes(msg.id!)));
    } catch (err) {
      console.error('Error deleting messages:', err);
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    if (!messageId) return;

    try {
      const response = await generateMessage(
        '',
        user,
        char,
        chat_uuid,
        setMessages,
        setIsGenerating,
        'Regenerate',
        messageId
      );

      if (response?.emotion_type && onEmotionDetected) {
        onEmotionDetected(response.emotion_type);
      }

    } catch (err) {
      console.error('Error regenerating message:', err);
    }
  };

  const handleEditMessage = async (
    messageId: string,
    editedMessage: string,
    type: 'user' | 'char'
  ) => {
    if (!messageId || !editedMessage) return;

    try {
      await Utils.db.update({
        tables: 'chat_messages',
        values: {
          [type === 'user' ? 'user_message' : 'char_message']: editedMessage,
        },
        match: {
          id: messageId,
          user_uuid: user.user_uuid,
          chat_uuid,
        },
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId && msg.type === type
            ? { ...msg, text: editedMessage }
            : msg
        )
      );
    } catch (err) {
      console.error('Error updating message:', err);
    }
  };

  const onGenerateImage = async (messageId: string) => {
    try {
      const prompt = previous_message
        .slice(-10)
        .map((msg) => `${char.persona}. ${msg.text}`)
        .join(' ');

      const res = await Utils.post('/api/ImageGen', {
        type: 'Anime',
        query: prompt,
      });

      const imageUrl = (res as ImageGenerationResponse)?.data?.data?.[0]?.url;
      if (!imageUrl) return;

      const newMsg: Message = {
        id: `image-${Date.now()}`,
        type: 'char',
        text: `![Generated Image](${imageUrl})`,
        name: char.name,
        profile_image: char.profile_image,
      };

      await Utils.db.insert({
        tables: 'chat_messages',
        data: {
          user_uuid: user.user_uuid,
          chat_uuid,
          char_message: newMsg.text,
          is_image: true,
        },
      });

      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  return {
    isSettingsOpen,
    isAdModalOpen,
    setIsAdModalOpen,
    toggleSettings,
    handleSend,
    handleRemoveMessage,
    handleRegenerateMessage,
    handleEditMessage,
    onGenerateImage,
  };
};
