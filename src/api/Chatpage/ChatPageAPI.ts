import { useChatStore } from '~/store';
import { Character, Message } from '@shared-types';
import * as Sentry from '@sentry/react';
import { supabase } from '~/Utility/supabaseClient';
import { getChatData } from '@components';

interface ChatMessageWithId {
  id: string;
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
  firstMessage: string;
}> => {
  if (!chat_uuid) {
    throw new Error('Missing chat_uuid');
  }

  try {
    const Character = await getChatData(chat_uuid);

    if ('error' in Character) {
      throw new Error(Character.error);
    }

    const character: Character = {
      char_uuid: Character.char_uuid || '',
      name: Character.name || 'Anon',
      persona: Character.persona || '',
      scenario: Character.scenario || '',
      gender: Character.gender || '',
      description: Character.description || '',
      first_message: Character.first_message || '',
      tags: Character.tags || [],
      profile_image: Character.profile_image || '',
      model_instructions: Character.model_instructions || '',
      creator: Character.creator ?? null,
      is_public: Character.is_public || false,
      is_nsfw: Character.is_nsfw || false,
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

    const formattedMessages: Message[] = reversedMessages.flatMap(
      (msg: ChatMessageWithId) => {
        const messages: Message[] = [];

        if (msg.user_message) {
          messages.push({
            id: `${msg.id}`,
            name: character.name || 'Anon',
            text: msg.user_message,
            profile_image: avatar_url || '',
            type: 'user',
            chat_uuid,
          });
        }

        if (msg.char_message) {
          messages.push({
            id: `${msg.id}`,
            name: character.name || 'Anon',
            text: msg.char_message,
            profile_image: character.profile_image || '',
            type: 'assistant',
            chat_uuid,
            gender: character.gender,
          });
        }

        return messages;
      }
    );

    useChatStore.getState().setMessages(formattedMessages);

    return {
      character,
      firstMessage: character.first_message,
    };
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureException(new Error(String(error)));
    }
    throw error;
  }
};
