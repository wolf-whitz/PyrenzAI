import { Character, Message } from '@shared-types/chatTypes';
import * as Sentry from '@sentry/react';
import { supabase } from '~/Utility/supabaseClient';
import { getChatData } from '@components';
import { PyrenzAlert } from '@components';

interface ChatMessageWithId {
  id: string;
  user_message: string | null;
  char_message: string | null;
  conversation_id: string;
  created_at: string;
}

export const fetchChatData = async (
  conversation_id: string,
  username: string,
  avatar_url: string
): Promise<{
  character: Character;
  messages: Message[];
  firstMessage: string;
}> => {
  if (!conversation_id) {
    PyrenzAlert('Missing conversation_id', 'Alert');
    throw new Error('Missing conversation_id');
  }

  try {
    const characterData = await getChatData(conversation_id);

    if (characterData.error) {
      PyrenzAlert(characterData.error, 'Alert');
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
      .select('id, user_message, char_message, conversation_id, created_at')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: false });

    if (error) {
      PyrenzAlert('Error fetching messages from Supabase: ' + error.message, 'Alert');
      Sentry.captureException(error);
      throw error;
    }

    const reversedMessages = (data || []).reverse();

    const formattedMessages = reversedMessages.flatMap(
      (msg: ChatMessageWithId) => {
        const messages: Message[] = [];

        if (msg.user_message) {
          messages.push({
            id: msg.id,
            text: msg.user_message,
            icon: avatar_url || '',
            type: 'user',
            conversation_id,
          });
        }

        if (msg.char_message) {
          messages.push({
            id: msg.id,
            text: msg.char_message,
            icon: character.profile_image || '',
            type: 'assistant',
            conversation_id,
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
      PyrenzAlert('Error fetching chat data: ' + error.message, 'Alert');
      Sentry.captureException(error);
    } else {
      PyrenzAlert('An unknown error occurred.', 'Alert');
      Sentry.captureException(error);
    }
    throw error;
  }
};
