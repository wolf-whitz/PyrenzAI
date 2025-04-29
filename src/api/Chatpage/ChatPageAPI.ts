import { Utils } from '~/Utility/Utility';
import { Character, Message } from '@shared-types/chatTypes';
import { toast } from 'react-toastify';

export const fetchChatData = async (
  conversation_id: string,
  user_uuid?: string,
  auth_key?: string
): Promise<{ character: Character; messages: Message[]; firstMessage: string }> => {
  if (!conversation_id) {
    toast.error('Missing conversation_id 😬');
    throw new Error('Missing conversation_id 😬');
  }
  if (!user_uuid || !auth_key) {
    toast.error('Auth info missing. Who even are you? 👀');
    throw new Error('Auth info missing. Who even are you? 👀');
  }

  const chatPayload = {
    type: 'getchatid',
    conversation_id,
    user_uuid,
    auth_key,
  };

  try {
    const { character } = await Utils.post<{ character: Character }>(
      '/api/Chats',
      chatPayload
    );

    if (!character) {
      toast.error('Character not found.');
      throw new Error('Character not found.');
    }

    const messagesPayload = {
      conversation_id,
      user_uuid,
      auth_key,
    };

    const { messages: rawMessages } = await Utils.post<{ messages: any[] }>(
      '/api/GetMessages',
      messagesPayload
    );

    if (!Array.isArray(rawMessages)) {
      toast.error('Messages came back cursed 😩 (invalid format)');
      throw new Error('Messages came back cursed 😩 (invalid format)');
    }

    const formattedMessages: Message[] = rawMessages.flatMap((msg) => {
      const userMsg = msg.user_message && {
        name: 'User',
        text: msg.user_message,
        icon: '',
        type: 'user',
        conversation_id,
      };

      const aiMsg = msg.ai_message && {
        name: character.name || 'Assistant',
        text: msg.ai_message,
        icon: character.image_url,
        type: 'assistant',
        conversation_id,
      };

      return [userMsg, aiMsg].filter(Boolean) as Message[];
    });

    return {
      character,
      messages: formattedMessages,
      firstMessage: character.first_message,
    };
  } catch (error) {
    if (error instanceof Error) {
      toast.error('Error fetching chat data: ' + error.message);
    } else {
      toast.error('An unknown error occurred.');
    }
    throw error;
  }
};
