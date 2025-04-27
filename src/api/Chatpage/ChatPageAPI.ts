import { Utils } from '~/Utility/Utility';
import { Character, Message } from '@shared-types/chatTypes';

export const fetchChatData = async (
  conversation_id: string,
  user_uuid?: string,
  auth_key?: string
) => {
  if (!conversation_id) throw new Error('Missing conversation_id 😬');
  if (!user_uuid || !auth_key)
    throw new Error('Auth info missing. Who even are you? 👀');

  const chatPayload = {
    type: 'getchatid',
    conversation_id,
    user_uuid,
    auth_key,
  };

  const { character } = await Utils.post<{ character: Character }>(
    '/api/Chats',
    chatPayload
  );

  if (!character) throw new Error('Character not found.');

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
};
