import { useCallback } from 'react';
import { Utils } from '~/Utility/Utility';
import { GenerateResponse, Message } from '@shared-types/chatTypes';
import { GetUserUUID } from '@components';
import { supabase } from '~/Utility/supabaseClient';
import { PyrenzAlert } from '@components';

interface GenerateMessageResponse {
  remainingMessages: number;
}

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
    ): Promise<GenerateMessageResponse> => {
      if (!user || !char || !conversation_id) {
        return { remainingMessages: 0 };
      }

      const userMessage: Message = {
        username: user.username,
        text,
        icon: user.icon,
        type: 'user',
      };
      const assistantMessage: Message = {
        character_name: char.character_name ?? 'Assistant',
        text: '',
        icon: char.icon,
        type: 'assistant',
        isGenerate: true,
      };

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, userMessage, assistantMessage];
        return newMessages;
      });
      setIsGenerating(true);

      try {
        const user_uuid = await GetUserUUID();

        const { data: userData, error: userDataError } = await supabase
          .from('user_data')
          .select('inference_settings')
          .eq('user_uuid', user_uuid)
          .single();

        if (userDataError) {
          throw new Error('Failed to fetch inference settings');
        }

        const { inference_settings } = userData;

        const adWatchKey = localStorage.getItem('ad_watch_token');
        const connectionParams = new URLSearchParams();
        connectionParams.append('user_uuid', user_uuid as string);
        if (adWatchKey) {
          connectionParams.append('ad_watch_key', adWatchKey);
        }

        const url = `/api/Generate?${connectionParams.toString()}`;

        const payload: any = {
          Type: 'Generate',
          ConversationId: conversation_id,
          Message: { User: text },
          Engine: 'b234e3de-7dbb-4a4c-b7c0-d8d4dce4f3c5',
          inference_settings,
        };

        const response = await Utils.post<GenerateResponse>(url, payload);

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
          return updatedMessages;
        });

        if (adWatchKey) {
          localStorage.removeItem('ad_watch_token');
        }

        const remainingMessages = response.remainingMessages || 0;
        return { remainingMessages };
      } catch (error) {
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
          return updatedMessages;
        });

        PyrenzAlert('Failed to generate response.', 'Alert');
        return { remainingMessages: 0 };
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return generateMessage;
};
