import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@shared-types';
import { GetUserUUID, useTabFocus } from '@components';
import { usePyrenzAlert } from '~/provider';
import { NotificationManager, Utils } from '~/Utility';

interface GenerateMessageResponse {
  remainingMessages?: number;
  showAd?: boolean;
  isSubscribed?: boolean;
  emotion_type?: string;
}

interface UserDataRow {
  inference_settings: any;
}

interface RawMessageRow {
  user_message: string | null;
  char_message: string | null;
  alternative_messages: string[] | null;
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
      setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
      generationType: 'Generate' | 'Regenerate' = 'Generate',
      messageId?: string
    ): Promise<GenerateMessageResponse> => {
      if (!user || !char || !chat_uuid) return { isSubscribed: false };
      setIsGenerating(true);

      let userQueryText = text;
      let charMessageText: string | null = null;
      let previousCharMsg: string | null = null;
      let previousAlternatives: string[] = [];

      if (generationType === 'Generate') {
        const userMessage: Message = {
          id: undefined,
          user_id: undefined,
          username: user.username,
          text,
          profile_image: user.user_avatar,
          type: 'user',
        };

        const charMessage: Message = {
          id: uuidv4(),
          char_id: undefined,
          name: char.name || char.character_name || 'AI',
          text: '',
          profile_image: char.user_avatar,
          type: 'char',
          isGenerate: true,
          alternative_messages: [],
        };

        setMessages((prev) => [...prev, userMessage, charMessage]);
      } else if (generationType === 'Regenerate') {
        if (!messageId) {
          showAlert('Missing message ID for regeneration', 'Alert');
          setIsGenerating(false);
          return { isSubscribed: false };
        }

        try {
          const result = await Utils.db.select<RawMessageRow>({
            tables: 'chat_messages',
            columns: 'user_message, char_message, alternative_messages',
            match: { id: messageId },
            nocache: true,
          });

          const row = result?.data?.[0];

          if (!row?.user_message || !row?.char_message) {
            showAlert('Could not find original messages for regen', 'Alert');
            setIsGenerating(false);
            return { isSubscribed: false };
          }

          userQueryText = row.user_message;
          charMessageText = row.char_message;
          previousCharMsg = row.char_message;
          previousAlternatives = row.alternative_messages ?? [];
        } catch {
          showAlert('Failed to fetch messages for regeneration', 'Alert');
          setIsGenerating(false);
          return { isSubscribed: false };
        }
      }

      try {
        const user_uuid = await GetUserUUID();
        const { data: userData } = await Utils.db.select<UserDataRow>({
          tables: 'user_data',
          columns: 'inference_settings',
          match: { user_uuid },
        });

        if (!userData?.[0]) throw new Error('No inference settings found');

        const messagePayload =
          generationType === 'Generate'
            ? { query: userQueryText }
            : {
                query: userQueryText,
                CharMessage: charMessageText,
                MessageID: Number(messageId),
              };

        const body = {
          type: generationType,
          chat_uuid,
          inference_settings: userData[0].inference_settings,
          message: messagePayload,
        };

        const url = `/api/Generate?user_uuid=${user_uuid}`;
        const res = await Utils.post<any>(url, body);
        const generatedMessage = res.message?.content;
        const responseId = res.message?.MessageID;
        const user_id = res.message?.user_id;
        const char_id = res.message?.char_id;
        const emotion_type = res.message?.emotion_type;

        if (!generatedMessage) throw new Error('No valid response from API');

        if (generationType === 'Generate') {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.isGenerate) {
                return {
                  ...msg,
                  id: responseId,
                  text: generatedMessage,
                  isGenerate: false,
                  char_id: Number(char_id),
                  alternative_messages: [],
                  ...(emotion_type && { emotion_type }),
                };
              } else if (msg.type === 'user' && msg.id === undefined) {
                return { ...msg, id: responseId, user_id: Number(user_id) };
              }
              return msg;
            })
          );
        }

        if (generationType === 'Regenerate' && messageId) {
          const cleanPrevMsg = previousCharMsg?.trim() ?? '';
          
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === messageId && msg.type === 'char') {
                const existing = msg.alternative_messages ?? [];
                const newAlternatives = cleanPrevMsg 
                  ? [...existing, cleanPrevMsg]
                  : existing;
                return {
                  ...msg,
                  text: generatedMessage,
                  isGenerate: false,
                  alternative_messages: newAlternatives,
                  ...(emotion_type && { emotion_type }),
                };
              }
              return msg;
            })
          );
        }

        await NotificationManager.fire({
          title: `${char.name || char.character_name || 'AI'}: replied!`,
          body: generatedMessage.slice(0, 100),
          icon: char.user_avatar,
          vibrateIfPossible: !isTabFocused,
          charName: char.name || char.character_name || 'AI',
          userName: user.username,
        });

        return {
          isSubscribed: Boolean(res?.isSubscribed),
          remainingMessages: res?.remainingMessages ?? 0,
          showAd: res?.remainingMessages === 0,
        };
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        showAlert(`Error occurred: ${msg}`, 'Alert');
        return { isSubscribed: false, remainingMessages: 0, showAd: false };
      } finally {
        setIsGenerating(false);
      }
    },
    [showAlert, isTabFocused]
  );

  return generateMessage;
};
