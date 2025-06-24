import { useChatStore } from '~/store';
import { Character, Message } from '@shared-types';
import * as Sentry from '@sentry/react';
import { supabase } from '~/Utility/supabaseClient';
import { getChatData, GetUserData } from '@components';

interface ChatMessageWithId {
  id: string;
  user_message: string | null;
  char_message: string | null;
  chat_uuid: string;
  created_at: string;
}

interface FetchChatDataResult {
  is_error: boolean;
  Character?: Character;
  firstMessage?: string;
  error?: string;
}

export const fetchChatData = async (
  chat_uuid: string
): Promise<FetchChatDataResult> => {
  if (!chat_uuid) {
    return { is_error: true, error: 'Missing chat_uuid' };
  }

  try {
    const userData = await GetUserData();
    if ('error' in userData) {
      return { is_error: true, error: userData.error };
    }

    const characterData = await getChatData(chat_uuid);
    if ('error' in characterData) {
      return { is_error: true, error: characterData.error };
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, user_message, char_message, chat_uuid, created_at')
      .eq('chat_uuid', chat_uuid)
      .order('created_at', { ascending: false });

    if (error) {
      Sentry.captureException(error);
      return { is_error: true, error: 'Failed to fetch chat messages' };
    }

    const reversedMessages = (data || []).reverse();

    const formattedMessages: Message[] = reversedMessages.flatMap(
      (msg: ChatMessageWithId) => {
        const messages: Message[] = [];

        if (msg.user_message) {
          messages.push({
            id: `${msg.id}`,
            name: userData.username || 'Anon',
            text: msg.user_message,
            profile_image: userData.user_avatar || '',
            type: 'user',
            chat_uuid,
          });
        }

        if (msg.char_message) {
          messages.push({
            id: `${msg.id}`,
            name: characterData.name || 'Anon',
            text: msg.char_message,
            profile_image: characterData.profile_image || '',
            type: 'char',
            chat_uuid,
            gender: characterData.gender,
          });
        }

        return messages;
      }
    );
    useChatStore.getState().setMessages(formattedMessages);

    return {
      is_error: false,
      Character: characterData,
      firstMessage: characterData.first_message,
    };
  } catch (error) {
    Sentry.captureException(error instanceof Error ? error : new Error(String(error)));
    return { is_error: true, error: 'An error occurred while fetching chat data' };
  }
};
