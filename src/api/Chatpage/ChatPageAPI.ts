import { Character, Message } from '@shared-types/chatTypes';
import * as Sentry from '@sentry/react';
import { supabase } from '~/Utility/supabaseClient';
import { getChatData } from '@components';

interface ChatMessageWithId {
  id: number;
  user_message: string | null;
  char_message: string | null;
  chat_uuid: string;
  created_at: string;
}

export const fetchChatData = async (
  chat_uuid: string,
  avatar_url: string
): Promise<{
  character: Character;
  messages: Message[];
  firstMessage: string;
}> => {
  if (!chat_uuid) {
    throw new Error('Missing chat_uuid');
  }

  try {
    const characterData = await getChatData(chat_uuid);

    if (characterData.error) {
      throw new Error(characterData.error);
    }

    const character: Character = {
      character_name: characterData.name || 'Assistant',
      persona: characterData.persona || '',
      scenario: characterData.scenario || '',
      gender: characterData.gender || '',
      description: characterData.description || '',
      first_message: characterData.first_message || '',
      tags: characterData.tags || [],
      profile_image: characterData.profile_image || '',
      token_total: characterData.token_total || 0,
    };

    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, user_message, char_message, chat_uuid, created_at')
      .eq('chat_uuid', chat_uuid)
      .order('created_at', { ascending: false });

    if (error) {
      Sentry.captureException(error);
      throw error;
    }

    const reversedMessages = (data || []).reverse();

    const formattedMessages = reversedMessages.flatMap(
      (msg: ChatMessageWithId) => {
        const messages: Message[] = [];

        if (msg.user_message) {
          messages.push({
            id: `${msg.id}`,
            text: msg.user_message,
            icon: avatar_url || '',
            type: 'user',
            chat_uuid,
          });
        }

        if (msg.char_message) {
          messages.push({
            id: `${msg.id}`,
            text: msg.char_message,
            icon: character.profile_image || '',
            type: 'assistant',
            chat_uuid,
            gender: character.gender,
          });
        }

        return messages;
      }
    );

    return {
      character,
      messages: formattedMessages,
      firstMessage: character.first_message,
    };
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureException(error);
    }
    throw error;
  }
};
