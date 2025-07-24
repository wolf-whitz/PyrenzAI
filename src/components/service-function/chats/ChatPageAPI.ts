import { useChatStore } from '~/store';
import { Character, Message } from '@shared-types';
import * as Sentry from '@sentry/react';
import { Utils as utils } from '~/Utility';
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

    let messages: ChatMessageWithId[] = [];

    try {
      const result = await utils.db.select<ChatMessageWithId>({
        tables: 'chat_messages',
        columns: '*',
        match: { chat_uuid },
        orderBy: { column: 'created_at', ascending: false },
      });

      messages = result?.data ?? [];
    } catch (err) {
      Sentry.captureException(err);
      return { is_error: true, error: 'Failed to fetch chat messages' };
    }

    const reversedMessages = messages.reverse();

    const formattedMessages: Message[] = reversedMessages.flatMap((msg) => {
      const messages: Message[] = [];

      if (msg.user_message) {
        messages.push({
          id: msg.id,
          name: userData.username || 'Anon',
          text: msg.user_message,
          profile_image: userData.user_avatar || '',
          type: 'user',
          chat_uuid,
        });
      }

      if (msg.char_message) {
        messages.push({
          id: msg.id,
          name: characterData.name || 'Anon',
          text: msg.char_message,
          profile_image: characterData.profile_image || '',
          type: 'char',
          chat_uuid,
          gender: characterData.gender,
        });
      }

      return messages;
    });

    useChatStore.getState().setMessages(formattedMessages);

    return {
      is_error: false,
      Character: characterData,
      firstMessage: characterData.first_message,
    };
  } catch (err) {
    Sentry.captureException(
      err instanceof Error ? err : new Error(String(err))
    );
    return {
      is_error: true,
      error: 'An error occurred while fetching chat data',
    };
  }
};
