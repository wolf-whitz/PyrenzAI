import { useCallback } from 'react';
import { Utils } from '~/Utility/Utility';
import { GenerateResponse, Message } from '@shared-types/chatTypes';
import toast from 'react-hot-toast';
import { GetUserUUID } from '~/functions';
import { supabase } from '~/Utility/supabaseClient'; // Import the supabase client

export const useGenerateMessage = () => {
  const generateMessage = useCallback(
    async (
      text: string,
      user: any,
      char: any,
      conversation_id: string,
      setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
      messageIdRef: React.MutableRefObject<{
        charId: string | null;
        userId: string | null;
      }>,
      setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>
    ): Promise<void> => {
      console.log('generateMessage called with:', {
        text,
        user,
        char,
        conversation_id,
      });

      if (!user || !char || !conversation_id) {
        console.error('Missing required parameters');
        return;
      }

      const userMessage: Message = {
        name: user.name,
        text,
        icon: user.icon,
        type: 'user',
      };
      const assistantMessage: Message = {
        name: char.name ?? 'Assistant',
        text: '',
        icon: char.icon,
        type: 'assistant',
        isGenerate: true,
      };

      setMessages((prevMessages) => {
        console.log('Messages before update:', prevMessages);
        const newMessages = [...prevMessages, userMessage, assistantMessage];
        console.log('Messages after update:', newMessages);
        return newMessages;
      });
      setIsGenerating(true);

      try {
        const user_uuid = await GetUserUUID();

        // Fetch inference_settings from user_data table using supabase
        const { data: userData, error: userDataError } = await supabase
          .from('user_data')
          .select('inference_settings')
          .eq('user_uuid', user_uuid)
          .single();

        if (userDataError) {
          throw new Error('Failed to fetch inference settings');
        }

        const { inference_settings } = userData;

        const response = await Utils.post<GenerateResponse>('/api/Generate', {
          Type: 'Generate',
          ConversationId: conversation_id,
          Message: { User: text },
          Engine: 'b234e3de-7dbb-4a4c-b7c0-d8d4dce4f3c5',
          user_uuid,
          inference_settings,
        });

        console.log('API response:', response);

        if (!response?.data?.content) {
          throw new Error('No valid response from API');
        }

        const firstId = response.id?.[0] ?? {};
        messageIdRef.current = {
          charId: firstId.charMessageUuid ?? null,
          userId: firstId.userMessageUuid ?? null,
        };

        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((msg) =>
            msg.type === 'assistant' && msg.isGenerate
              ? { ...msg, text: response.data.content, isGenerate: false }
              : msg
          );
          console.log('Messages after API response:', updatedMessages);
          return updatedMessages;
        });
      } catch (error) {
        console.error('Failed to send message:', error);

        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((msg) =>
            msg.type === 'assistant' && msg.isGenerate
              ? {
                  ...msg,
                  text: 'Failed to generate response.',
                  isGenerate: false,
                  error: true,
                }
              : msg
          );
          console.log('Messages after error:', updatedMessages);
          return updatedMessages;
        });

        toast.error('Failed to generate response.');
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return generateMessage;
};
