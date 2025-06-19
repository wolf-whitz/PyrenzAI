import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { useGenerateMessage } from '@api';
import { useChatStore } from '~/store';
import { Message, User, Character } from '@shared-types';

interface ChatPageAPI {
  isSettingsOpen: boolean;
  isAdModalOpen: boolean;
  setIsAdModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSettings: () => void;
  handleSend: (message: string) => Promise<void>;
  handleGoHome: () => void;
  handleRemoveMessage: (messageId: string) => Promise<void>;
  handleRegenerateMessage: (messageId: string) => Promise<void>;
  handleEditMessage: (messageId: string, editedMessage: string, type: 'user' | 'char') => Promise<void>;
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
  const navigate = useNavigate();
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

      if (response.isSubscribed) {
        return;
      }

      if (response.remainingMessages === 0) {
        setIsAdModalOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGoHome = (): void => {
    navigate('/home');
  };

  const handleRemoveMessage = async (messageId: string): Promise<void> => {
    if (!messageId) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('Error deleting message:', error);
      } else {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== messageId)
        );
      }
    } catch (error) {
      console.error('Error deleting message:', error);
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
      const { error } = await supabase
        .from('chat_messages')
        .update({ [columnName]: editedMessage })
        .eq('id', messageId)
        .eq('user_uuid', user.user_uuid)
        .eq('chat_uuid', chat_uuid);

      if (error) {
        console.error('Error updating message:', error);
      } else {
        console.log('Message updated successfully');
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
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  return {
    isSettingsOpen,
    isAdModalOpen,
    setIsAdModalOpen,
    toggleSettings,
    handleSend,
    handleGoHome,
    handleRemoveMessage,
    handleRegenerateMessage,
    handleEditMessage,
  };
};
