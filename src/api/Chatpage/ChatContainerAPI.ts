import { useCallback } from 'react';
import { Utils } from '~/Utility/Utility';
import { GenerateResponse, Message } from '@shared-types';
import { GetUserUUID } from '@components';
import { supabase } from '~/Utility/supabaseClient';
import { usePyrenzAlert } from '~/provider';

interface CustomError {
  error: string;
  show_ad?: boolean;
}

interface GenerateMessageResponse {
  remainingMessages: number;
  showAd?: boolean;
}

export const useGenerateMessage = () => {
  const showAlert = usePyrenzAlert();

  const generateMessage = useCallback(
    async (
      text: string,
      user: any,
      char: any,
      chat_uuid: string,
      setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
      setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>
    ): Promise<GenerateMessageResponse> => {
      if (!user || !char || !chat_uuid) {
        return { remainingMessages: 0 };
      }

      setIsGenerating(true);

      const userMessage: Message = {
        id: undefined,
        username: user.username,
        text,
        profile_image: user.user_avatar,
        type: 'user',
      };

      const assistantMessage: Message = {
        id: undefined,
        name: char.character_name ?? 'Assistant',
        text: '',
        profile_image: char.user_avatar,
        type: 'assistant',
        isGenerate: true,
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        assistantMessage,
      ]);

      try {
        const user_uuid = await GetUserUUID();
        const { data: userData, error: userDataError } = await supabase
          .from('user_data')
          .select('inference_settings')
          .eq('user_uuid', user_uuid)
          .single();

        if (userDataError)
          throw new Error('Failed to fetch inference settings');

        const { inference_settings } = userData;
        const adWatchKey = localStorage.getItem('ad_watch_token');
        const connectionParams = new URLSearchParams();
        connectionParams.append('user_uuid', user_uuid as string);

        if (adWatchKey) {
          connectionParams.append('ad_watch_key', adWatchKey);
          localStorage.removeItem('ad_watch_token');
        }

        const url = `/api/Generate?${connectionParams.toString()}`;
        const payload = {
          Type: 'Generate',
          chat_uuid,
          Message: { User: text },
          Engine: 'b234e3de-7dbb-4a4c-b7c0-d8d4dce4f3c5',
          inference_settings,
        };

        const response = await Utils.post<GenerateResponse>(url, payload);

        if (!response?.data?.content)
          throw new Error('No valid response from API');

        const responseId = response.id?.[0]?.charMessageUuid;

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.isGenerate
              ? {
                  ...msg,
                  id: responseId,
                  text: response.data.content,
                  isGenerate: false,
                }
              : msg.type === 'user' && msg.id === undefined
                ? { ...msg, id: responseId }
                : msg
          )
        );

        return { remainingMessages: response.remainingMessages || 0 };
      } catch (error) {
        let errorMessage = 'Failed to generate response.';
        let showAd = false;

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === 'object' &&
          error !== null &&
          'error' in error
        ) {
          const customError = error as CustomError;
          errorMessage = customError.error;
          showAd = customError.show_ad || false;
        }

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.isGenerate
              ? {
                  ...msg,
                  id: undefined,
                  text: errorMessage,
                  isGenerate: false,
                  error: true,
                }
              : msg
          )
        );

        if (!showAd) showAlert(errorMessage, 'Alert');

        return { remainingMessages: 0, showAd };
      } finally {
        setIsGenerating(false);
      }
    },
    [showAlert]
  );

  return generateMessage;
};
