import { supabase } from '@utils';
import { Character } from '@shared-types';

type ChatDataResult = Character | { error: string };

export async function getChatData(chatId: string): Promise<ChatDataResult> {
  const { data: chatData, error: chatError } = await supabase
    .from('chats')
    .select('char_uuid')
    .eq('chat_uuid', chatId)
    .single();

  if (chatError || !chatData) {
    return { error: 'Chat not found' };
  }

  const inputCharUuid = chatData.char_uuid;

  const { data: publicCharacterData, error: publicCharacterError } =
    await supabase
      .from('public_characters')
      .select('*')
      .eq('char_uuid', inputCharUuid)
      .single();

  if (!publicCharacterError && publicCharacterData) {
    return publicCharacterData;
  }

  const { data: privateCharacterData, error: privateCharacterError } =
    await supabase
      .from('private_characters')
      .select('*')
      .eq('char_uuid', inputCharUuid)
      .single();

  if (privateCharacterError || !privateCharacterData) {
    return { error: 'Character not found' };
  }

  return privateCharacterData;
}
