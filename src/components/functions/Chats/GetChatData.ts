import { supabase } from '~/Utility/supabaseClient';
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

  const { data: characterData, error: characterError } = await supabase
    .from('characters')
    .select('*')
    .eq('char_uuid', inputCharUuid)
    .single();

  if (characterError || !characterData) {
    return { error: 'Character not found' };
  }

  return characterData;
}
