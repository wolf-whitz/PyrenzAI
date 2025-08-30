import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@shared-types';
import { GetUserUUID, useTabFocus } from '@components';
import { usePyrenzAlert } from '~/provider';
import { NotificationManager, Utils } from '~/utility';

interface GenerateMessageResponse {
  remainingMessages?: number;
  showAd?: boolean;
  isSubscribed?: boolean;
  emotion_type?: string;
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
      current: number,
      setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
      setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
      generationType: 'Generate' | 'Regenerate' = 'Generate',
      messageId?: number
    ): Promise<GenerateMessageResponse> => {
      if (!user || !char || !chat_uuid) return { isSubscribed: false };
      setIsGenerating(true);

      if (generationType === 'Generate') {
        const userMessage: Message = {
          id: Date.now(),
          user_id: user.user_uuid,
          username: user.username,
          name: user.username,
          text,
          profile_image: user.user_avatar,
          type: 'user',
          chat_uuid,
          isGenerate: false,
          role: 'user',
          error: false,
          gender: user.gender || '',
          char_id: char.char_id,
          alternative_messages: [],
          current: 0,
          emotion_type: '',
        };

        const charMessageObj: Message = {
          id: Date.now() + 1,
          char_id: char.char_id,
          name: char.name || char.character_name || 'AI',
          text: '',
          profile_image: char.profile_image || char.user_avatar,
          type: 'char',
          chat_uuid,
          isGenerate: true,
          role: 'assistant',
          error: false,
          gender: char.gender || '',
          user_id: user.user_uuid,
          username: char.name || char.character_name || 'AI',
          alternative_messages: [],
          current: 0,
          emotion_type: '',
        };

        setMessages((prev) => [...prev, userMessage, charMessageObj]);

        try {
          const inserted = await Utils.db.insert({
            tables: 'chat_messages',
            data: { chat_uuid, user_uuid: user.user_uuid, user_message: text },
          });
          messageId = Number((inserted[0] as any).id);
        } catch (err) {
          console.error(err);
        }
      }

      try {
        const user_uuid = await GetUserUUID();
        const { data: userData } = await Utils.db.select<UserDataRow>({
          tables: 'user_data',
          columns: 'inference_settings',
          match: { user_uuid },
        });

        if (!userData?.[0] || messageId == null) throw new Error('Missing required data');

        const messagePayload = { current, MessageID: messageId, ...(generationType === 'Generate' ? { is_first: true } : {}) };
        const body = { type: generationType, chat_uuid, inference_settings: userData[0].inference_settings, message: messagePayload };
        const url = `/api/Generate?user_uuid=${user_uuid}`;
        const res = await Utils.post<any>(url, body);

        const generatedMessage = res.message?.content;
        const responseId = res.message?.MessageID;
        const emotion_type = res.message?.emotion_type;
        if (!generatedMessage) throw new Error('No valid response from API');

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.isGenerate) {
              return { ...msg, id: responseId, text: generatedMessage, isGenerate: false, char_id: char.char_id, alternative_messages: [], ...(emotion_type && { emotion_type }) };
            } else if (msg.type === 'user' && msg.id == null) {
              return { ...msg, id: responseId, user_id: user.user_uuid };
            } else if (generationType === 'Regenerate' && msg.id === messageId && msg.type === 'char') {
              const currentAlternatives = msg.alternative_messages || [];
              const newAlternatives = [...currentAlternatives];
              
              if (!newAlternatives.includes(generatedMessage)) {
                newAlternatives.push(generatedMessage);
              }
              
              Utils.db.update({
                tables: 'chat_messages',
                values: { alternative_messages: newAlternatives },
                match: { id: messageId }
              }).catch(err => console.error('Failed to update alternative messages:', err));
              
              return { 
                ...msg, 
                alternative_messages: newAlternatives,
                current: newAlternatives.length - 1,
                ...(emotion_type && { emotion_type })
              };
            }
            return msg;
          })
        );

        await NotificationManager.fire({
          title: `${char.name || char.character_name || 'AI'}: replied!`,
          body: generatedMessage.slice(0, 100),
          icon: char.user_avatar,
          vibrateIfPossible: !isTabFocused,
          charName: char.name || char.character_name || 'AI',
          userName: user.username,
        });

        return { isSubscribed: Boolean(res?.isSubscribed), remainingMessages: res?.remainingMessages ?? 0, showAd: res?.remainingMessages === 0, emotion_type };
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

  const deleteMessage = useCallback(
    async (messageId: number, setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
      if (messageId == null) return;

      try {
        setMessages((prev) => {
          const targetIndex = prev.findIndex((msg) => msg.id === messageId);
          if (targetIndex === -1) return prev;
          
          const messagesToDelete = prev.slice(targetIndex);
          const idsToDelete = messagesToDelete.map(msg => msg.id).filter(id => id != null);
          
          idsToDelete.forEach(async (id) => {
            try {
              await Utils.db.remove({ tables: 'chat_messages', match: { id } });
            } catch (err) {
              console.error(`Failed to delete message ${id}:`, err);
            }
          });
          
          return prev.slice(0, targetIndex);
        });
      } catch (err) {
        console.error(err);
        showAlert('Failed to delete message', 'Alert');
      }
    },
    [showAlert]
  );

  return { generateMessage, deleteMessage };
};
