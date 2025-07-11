import { useCallback } from 'react';
import { GenerateResponse, Message } from '@shared-types';
import { GetUserUUID, useTabFocus } from '@components';
import { usePyrenzAlert } from '~/provider';
import { NotificationManager, supabase, Utils } from '~/Utility';

interface CustomError {
  error: string;
  show_ad?: boolean;
}

interface GenerateMessageResponse {
  remainingMessages?: number;
  showAd?: boolean;
  isSubscribed?: boolean;
}

export const useGenerateMessage = () => {
  const showAlert = usePyrenzAlert();
  const isTabFocused = useTabFocus();

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
        return { isSubscribed: false };
      }

      setIsGenerating(true);

      const userMessage: Message = {
        id: undefined,
        username: user.username,
        text,
        profile_image: user.user_avatar,
        type: 'user',
      };

      const charMessage: Message = {
        id: undefined,
        name: char.name || char.character_name || 'AI',
        text: '',
        profile_image: char.user_avatar,
        type: 'char',
        isGenerate: true,
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        charMessage,
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
          inference_settings,
        };

        const response = await Utils.post<GenerateResponse>(url, payload);

        if (!response?.data?.content)
          throw new Error('No valid response from API');

        const responseId = response.id?.[0]?.MessageID;

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

        await NotificationManager.fire({
          title: `{{char}}: replied!`,
          body: response.data.content.slice(0, 100),
          icon: char.user_avatar,
          vibrateIfPossible: !isTabFocused,
          charName: char.name || char.character_name || 'AI',
          userName: user.username,
        });

        if (response.remainingMessages === undefined) {
          const { data: subscriptionData, error: subscriptionError } =
            await supabase
              .from('subscription_plan')
              .select('is_subscribed')
              .eq('user_uuid', user_uuid)
              .single();

          if (subscriptionError) {
            console.error(
              'Error fetching subscription status:',
              subscriptionError
            );
            return { isSubscribed: false };
          }

          return { isSubscribed: subscriptionData?.is_subscribed };
        }

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
    [showAlert, isTabFocused]
  );

  return generateMessage;
};
