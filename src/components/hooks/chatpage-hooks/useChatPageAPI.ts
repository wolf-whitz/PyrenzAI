import { useState } from 'react';
import { useGenerateMessage } from '@components';
import { useChatStore } from '~/store';
import { Message, User, Character } from '@shared-types';
import { Utils } from '~/utility';

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

  const getLatestCharMessageCurrent = (): number => {
    const latestChar = [...previous_message]
      .reverse()
      .find((msg) => msg.type === 'char');

    if (!latestChar) return 0;

    return latestChar.current ?? 0;
  };

  const getLatestCharMessageWithUserQuery = (): { charMessage: string; userQuery: string } => {
    const latestCharIndex = [...previous_message]
      .reverse()
      .findIndex((msg) => msg.type === 'char');

    const latestChar = latestCharIndex !== -1
      ? previous_message[previous_message.length - 1 - latestCharIndex]
      : undefined;

    const charMessage = latestChar
      ? (() => {
          const currentValue = latestChar.current ?? 0;
          if (currentValue === 0) return latestChar.text || '';
          return latestChar.alternative_messages?.[currentValue - 1] || latestChar.text || '';
        })()
      : char?.first_message?.[0] || '';

    const userMessage = latestChar
      ? previous_message
          .slice(0, previous_message.indexOf(latestChar))
          .reverse()
          .find((msg) => msg.type === 'user')
      : undefined;

    return {
      charMessage: charMessage || char?.first_message?.[0] || '',
      userQuery: userMessage?.text || '',
    };
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
      console.error('handleSend - Error:', err);
    }
  };

  const handleRemoveMessage = async (messageId: string) => {
    if (!messageId) return;

    const messageToRemove = previous_message.find((msg) => msg.id === messageId);
    if (!messageToRemove) return;

    const baseMessageId = typeof messageId === 'string' && messageId.includes('-alt-') 
      ? messageId.split('-alt-')[0] 
      : messageId;

    try {
      await Utils.db.remove({
        tables: 'chat_messages',
        match: { id: baseMessageId },
      });

      setMessages((prev) => prev.filter((msg) => {
        if (!msg.id) return true;
        const msgIdStr = String(msg.id);
        const msgBaseId = msgIdStr.includes('-alt-') 
          ? msgIdStr.split('-alt-')[0] 
          : msgIdStr;
        return msgBaseId !== baseMessageId;
      }));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    if (!messageId) return;

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
        current: 0,
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
