import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { useGenerateMessage } from '@api';

export const useChatPageAPI = (
  messagesEndRef: React.RefObject<HTMLDivElement>,
  previous_message: any[],
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  user: any,
  char: any,
  chat_uuid: string,
  messageIdRef: React.MutableRefObject<{
    charId: string | null;
    userId: string | null;
  }>,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const generateMessage = useGenerateMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const storedBgImage = localStorage.getItem('bgImage');
    if (storedBgImage) {
      setBgImage(storedBgImage);
    }
  }, []);

  useEffect(() => {
    const scrollWithDelay = () => {
      if (messagesEndRef?.current) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    };

    scrollWithDelay();
  }, [previous_message, messagesEndRef]);

  useEffect(() => {
    if (bgImage) {
      localStorage.setItem('bgImage', bgImage);
    } else {
      localStorage.removeItem('bgImage');
    }
  }, [bgImage]);

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const handleSend = async (message: string) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    try {
      const response = await generateMessage(
        trimmedMessage,
        user,
        char,
        chat_uuid,
        setMessages,
        messageIdRef,
        setIsGenerating
      );

      if (response.remainingMessages === 0) {
        setIsAdModalOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleRemoveMessage = async (messageId: string) => {
    if (!messageId) return;

    try {
      const baseId = messageId.split('-')[0];
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', baseId);

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
  const handleRegenerateMessage = async (messageId: string) => {
    if (!messageId) return;
  
    try {
      const baseId = messageId.split('-')[0];
  
      const userMessage = previous_message.find(
        (msg) => msg.id && msg.id.startsWith(baseId) && msg.type === 'user'
      );
  
      if (!userMessage) return;
  
      await handleRemoveMessage(messageId);
  
      await handleSend(userMessage.text);
    } catch (error) {
      console.error('Error regenerating message:', error);
    }
  };
  
  const handleEditMessage = async (messageId: string, editedMessage: string, type: 'user' | 'char') => {
    if (!messageId || !editedMessage) return;

    try {
      const baseId = messageId.split('-')[0];
      const columnName = type === 'user' ? 'user_message' : 'char_message';
      const { error } = await supabase
        .from('chat_messages')
        .update({ [columnName]: editedMessage })
        .eq('id', baseId)
        .eq('user_uuid', user.user_uuid)
        .eq('chat_uuid', chat_uuid);

      if (error) {
        console.error('Error updating message:', error);
      } else {
        console.log('Message updated successfully');
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, text: editedMessage } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  return {
    bgImage,
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
