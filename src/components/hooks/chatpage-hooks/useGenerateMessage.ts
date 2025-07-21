import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GenerateResponse, Message } from '@shared-types';
import { GetUserUUID, useTabFocus } from '@components';
import { usePyrenzAlert } from '~/provider';
import { NotificationManager, Utils } from '~/Utility';

interface GenerateMessageResponse {
  remainingMessages?: number;
  showAd?: boolean;
  isSubscribed?: boolean;
}

interface UserDataRow {
  inference_settings: any;
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

      const charMessageId = uuidv4();

      const charMessage: Message = {
        id: charMessageId,
        name: char.name || char.character_name || 'AI',
        text: '',
        profile_image: char.user_avatar,
        type: 'char',
        isGenerate: true,
      };

      setMessages((prev) => [...prev, userMessage, charMessage]);

      try {
        const user_uuid = await GetUserUUID();
        const { data: userData } = await Utils.db.select<UserDataRow>(
          'user_data',
          'inference_settings',
          null,
          { user_uuid }
        );

        if (!userData?.[0]) {
          throw new Error('Inference settings not found for this user');
        }

        const { inference_settings } = userData[0];

        const url = `/api/Generate?user_uuid=${user_uuid}`;
        const payload = {
          Type: 'Generate',
          chat_uuid,
          query: text,
          inference_settings,
        };

        const data = await Utils.post<GenerateResponse>(url, payload);

        if (!data?.content) throw new Error(`No valid response from API, Please share this with the developers: ${JSON.stringify(data)}`);

        const responseId = data.MessageID;

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.isGenerate
              ? {
                  ...msg,
                  id: responseId,
                  text: data.content,
                  isGenerate: false,
                }
              : msg.type === 'user' && msg.id === undefined
                ? { ...msg, id: responseId }
                : msg
          )
        );

        await NotificationManager.fire({
          title: `${char.name || char.character_name || 'AI'}: replied!`,
          body: data.content.slice(0, 100),
          icon: char.user_avatar,
          vibrateIfPossible: !isTabFocused,
          charName: char.name || char.character_name || 'AI',
          userName: user.username,
        });

        if (data.isSubscribed) {
          return {
            isSubscribed: true,
            showAd: false,
            remainingMessages: Number.MAX_SAFE_INTEGER,
          };
        }

        if (data.remainingMessages === 0) {
          return {
            isSubscribed: false,
            remainingMessages: 0,
            showAd: true,
          };
        }

        return {
          isSubscribed: false,
          remainingMessages: data.remainingMessages ?? 0,
          showAd: false,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        showAlert(`Error occurred: ${errorMessage}`, 'Alert');
        return {
          isSubscribed: false,
          remainingMessages: 0,
          showAd: false,
        };
      } finally {
        setIsGenerating(false);
      }
    },
    [showAlert, isTabFocused]
  );

  return generateMessage;
};
