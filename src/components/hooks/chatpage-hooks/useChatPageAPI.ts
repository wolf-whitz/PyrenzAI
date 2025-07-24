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
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>
): ChatPageAPI => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const generateMessage = useGenerateMessage();
  const { setMessages } = useChatStore();

  const toggleSettings = (): void => {
    setIsSettingsOpen((prev) => !prev);
  };

  const handleSend = async (message: string): Promise<void> => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    try {
      const response = await generateMessage(
        trimmedMessage,
        user,
        char,
        chat_uuid,
        setMessages,
        setIsGenerating
      );
      if (!response.isSubscribed && response.remainingMessages === 0) {
        setIsAdModalOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRemoveMessage = async (messageId: string): Promise<void> => {
    if (!messageId) return;

    const index = previous_message.findIndex((msg) => msg.id === messageId);
    if (index === -1) return;

    const messagesToDelete = previous_message
      .slice(index)
      .map((msg) => msg.id)
      .filter((id): id is string => !!id);

    if (!messagesToDelete.length) return;

    try {
      await Utils.db.remove({
        tables: 'chat_messages',
        match: { id: messagesToDelete },
      });

      setMessages((prevMessages) =>
        prevMessages.filter(
          (msg) =>
            typeof msg.id === 'string' && !messagesToDelete.includes(msg.id)
        )
      );
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };

  const handleRegenerateMessage = async (messageId: string): Promise<void> => {
    if (!messageId) return;

    try {
      const userMessage = previous_message.find(
        (msg) => msg.id === messageId && msg.type === 'user'
      );
      if (!userMessage) return;

      await handleRemoveMessage(messageId);
      await handleSend(userMessage.text);
    } catch (error) {
      console.error('Error regenerating message:', error);
    }
  };

  const handleEditMessage = async (
    messageId: string,
    editedMessage: string,
    type: 'user' | 'char'
  ): Promise<void> => {
    if (!messageId || !editedMessage) return;

    try {
      const columnName = type === 'user' ? 'user_message' : 'char_message';
      await Utils.db.update({
        tables: 'chat_messages',
        values: { [columnName]: editedMessage },
        match: {
          id: messageId,
          user_uuid: user.user_uuid,
          chat_uuid: chat_uuid,
        },
      });

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId && msg.type === type
            ? {
                ...msg,
                text: editedMessage,
                ...(type === 'user'
                  ? { user_message: editedMessage }
                  : { char_message: editedMessage }),
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const onGenerateImage = async (messageId: string): Promise<void> => {
    try {
      const lastTenMessages = previous_message.slice(-10);
      const personaPrompt = `The character's persona is: ${char.persona}. `;
      const prompt = lastTenMessages
        .map((msg) => {
          return `${personaPrompt}${msg.text}. The expressions are vivid, capturing every nuance of the characters involved.`;
        })
        .join(' ');

      const response = await Utils.post('/api/ImageGen', {
        type: 'Anime',
        query: prompt,
      });

      const imageResponse = response as ImageGenerationResponse;
      if (
        imageResponse.data &&
        imageResponse.data.data &&
        imageResponse.data.data.length > 0
      ) {
        const imageUrl = imageResponse.data.data[0].url;
        const newImageMessage: Message = {
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
            chat_uuid: chat_uuid,
            char_message: newImageMessage.text,
            is_image: true,
          },
        });

        setMessages((prevMessages) => [...prevMessages, newImageMessage]);
      }
    } catch (error) {
      console.error('Error generating image:', error);
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
