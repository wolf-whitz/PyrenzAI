import { Character, Message } from '@shared-types/chatTypes';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import { supabase } from '~/Utility/supabaseClient';
import GetChatData from '~/functions/Chats/GetChatData';

interface ChatMessageWithId {
  id: string;
  user_message: string | null;
  char_message: string | null;
  conversation_id: string;
  created_at: string;
}

export const fetchChatData = async (
  conversation_id: string
): Promise<{
  character: Character;
  messages: (Message & { id?: string })[];
  firstMessage: string;
}> => {
  if (!conversation_id) {
    toast.error('Missing conversation_id');
    throw new Error('Missing conversation_id');
  }

  try {
    const characterData = await GetChatData(conversation_id);

    if (characterData.error) {
      toast.error(characterData.error);
      throw new Error(characterData.error);
    }

    const character: Character = {
      name: characterData.name || '',
      persona: characterData.persona || '',
      scenario: characterData.scenario || '',
      gender: characterData.gender || '',
      description: characterData.description || '',
      first_message: characterData.first_message || '',
      tags: characterData.tags || [],
      profile_image: characterData.profile_image || '',
      token_total: characterData.token_total || 0,
      id: 0,
      uuid: '',
      user_name: '',
      icon: '',
    };

    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, user_message, char_message, conversation_id, created_at')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error fetching messages from Supabase: ' + error.message);
      Sentry.captureException(error);
      throw error;
    }

    const reversedMessages = (data || []).reverse();

    const formattedMessages = reversedMessages.flatMap(
      (msg: ChatMessageWithId) => {
        const messages: (Message & { id?: string })[] = [];

        if (msg.user_message) {
          messages.push({
            id: msg.id,
            name: 'User',
            text: msg.user_message,
            icon: '',
            type: 'user',
            conversation_id,
          });
        }

        if (msg.char_message) {
          messages.push({
            id: msg.id,
            name: character.name || 'Assistant',
            text: msg.char_message,
            icon:
              character.profile_image ||
              `https://api.dicebear.com/9.x/adventurer/svg?seed=${character.name || 'Anon'}`,
            type: 'assistant',
            conversation_id,
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
      toast.error('Error fetching chat data: ' + error.message);
      Sentry.captureException(error);
    } else {
      toast.error('An unknown error occurred.');
      Sentry.captureException(error);
    }
    throw error;
  }
};
