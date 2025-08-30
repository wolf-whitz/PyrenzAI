import { useState } from 'react';
import { useGenerateMessage } from '@components';
import { useChatStore } from '~/store';
import { Message, User, Character } from '@shared-types';
import { Utils } from '~/utility';

interface ImageGenerationResponse {
  data: {
    created: number;
    model: string;
    data: Array<{ url: string }>;
  };
}

interface ChatPageAPI {
  isSettingsOpen: boolean;
  isAdModalOpen: boolean;
  setIsAdModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSettings: () => void;
  handleSend: (message: string) => Promise<void>;
  handleRemoveMessage: (messageId: number) => Promise<void>;
  handleRegenerateMessage: (messageId: number) => Promise<void>;
  handleEditMessage: (
    messageId: number,
    editedMessage: string,
    type: 'user' | 'char'
  ) => Promise<void>;
  onGenerateImage: (messageId: number) => Promise<void>;
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
  const { generateMessage } = useGenerateMessage();
  const { setMessages } = useChatStore();

  const toggleSettings = () => setIsSettingsOpen((prev) => !prev);

  const getLatestCharMessageCurrent = (): number => {
    const latestChar = [...previous_message].reverse().find((msg) => msg.type === 'char');
    return latestChar?.current ?? 0;
  };

  const getLatestCharMessageWithUserQuery = (): { charMessage: string; userQuery: string } => {
    const latestCharIndex = [...previous_message].reverse().findIndex((msg) => msg.type === 'char');
    const latestChar =
      latestCharIndex !== -1
        ? previous_message[previous_message.length - 1 - latestCharIndex]
        : undefined;

    const charMessage = latestChar
      ? latestChar.current === 0
        ? latestChar.text || ''
        : latestChar.alternative_messages?.[latestChar.current - 1] || latestChar.text || ''
      : char.first_message?.[0] || '';

    const userMessage = latestChar
      ? previous_message.slice(0, previous_message.indexOf(latestChar)).reverse().find((msg) => msg.type === 'user')
      : undefined;

    return { charMessage: charMessage || '', userQuery: userMessage?.text || '' };
  };

  const handleSend = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    try {
      const current = getLatestCharMessageCurrent();
      const response = await generateMessage(
        trimmed,
        user,
        char,
        chat_uuid,
        current,
        setMessages,
        setIsGenerating,
        'Generate'
      );

      if (response?.emotion_type && onEmotionDetected) onEmotionDetected(response.emotion_type);
      if (!response.isSubscribed && response.remainingMessages === 0) setIsAdModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMessage = async (messageId: number) => {
    if (messageId == null) return;

    try {
      setMessages((prev) => {
        const targetIndex = prev.findIndex((msg) => msg.id === messageId);
        if (targetIndex === -1) return prev;
        
        const messagesToDelete = prev.slice(targetIndex);
        const idsToDelete = messagesToDelete.map(msg => msg.id).filter(id => id != null);
        
        idsToDelete.forEach(async (id) => {
          try {
            await Utils.db.remove({ tables: 'chat_messages', match: { id } });
          } catch (err) {
            console.error(`Failed to delete message ${id}:`, err);
          }
        });
        
        return prev.slice(0, targetIndex);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegenerateMessage = async (messageId: number) => {
    if (messageId == null) return;
    const { userQuery } = getLatestCharMessageWithUserQuery();
    const current = getLatestCharMessageCurrent();

    try {
      const response = await generateMessage(
        userQuery,
        user,
        char,
        chat_uuid,
        current,
        setMessages,
        setIsGenerating,
        'Regenerate',
        messageId
      );

      if (response?.emotion_type && onEmotionDetected) onEmotionDetected(response.emotion_type);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditMessage = async (
    messageId: number,
    editedMessage: string,
    type: 'user' | 'char'
  ) => {
    if (messageId == null || !editedMessage) return;

    try {
      await Utils.db.update({
        tables: 'chat_messages',
        values: { [type === 'user' ? 'user_message' : 'char_message']: editedMessage },
        match: { id: messageId, user_uuid: user.user_uuid, chat_uuid },
      });

      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId && msg.type === type ? { ...msg, text: editedMessage } : msg))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const onGenerateImage = async (messageId: number) => {
    if (messageId == null) return;

    try {
      const prompt = previous_message.slice(-10).map((msg) => `${char.persona}. ${msg.text}`).join(' ');
      const res = await Utils.post('/api/ImageGen', { type: 'Anime', query: prompt });
      const imageUrl = (res as ImageGenerationResponse)?.data?.data?.[0]?.url;
      if (!imageUrl) return;

      const newMsg: Message = {
        id: messageId,
        type: 'char',
        text: `![Generated Image](${imageUrl})`,
        name: char.name,
        profile_image: char.profile_image,
        current: 0,
      };

      await Utils.db.insert({
        tables: 'chat_messages',
        data: { user_uuid: user.user_uuid, chat_uuid, char_message: newMsg.text, is_image: true, id: messageId },
      });

      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error(err);
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
