import { supabase } from '~/Utility/supabaseClient';

interface ChatDataResponse {
  error?: string;
  name?: string;
  persona?: string;
  scenario?: string;
  gender?: string;
  description?: string;
  first_message?: string;
  tags?: string[];
  profile_image?: string;
  banner_image?: string;
  token_total?: number;
}

export default async function getChatData(
  chatId: string
): Promise<ChatDataResponse> {
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
    .select(`
      name,
      persona,
      scenario,
      gender,
      description,
      first_message,
      tags,
      profile_image,
      banner_image,
      token_total
    `)
    .eq('char_uuid', inputCharUuid)
    .single();

  if (characterError || !characterData) {
    return { error: 'Character not found' };
  }

  return {
    name: characterData.name,
    persona: characterData.persona,
    scenario: characterData.scenario,
    gender: characterData.gender,
    description: characterData.description,
    first_message: characterData.first_message,
    tags: characterData.tags,
    profile_image: characterData.profile_image,
    token_total: characterData.token_total,
  };
}
