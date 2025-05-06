import { supabase } from '~/Utility/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { GetUserUUID } from '~/functions';

interface CreateChatResponse {
  error?: string;
  chat_uuid?: string;
}

interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export default async function CreateNewChat(
  characterUuid: string,
): Promise<CreateChatResponse> {
  const chatUuid = uuidv4();

  try {
    const userUuid = await GetUserUUID();

    const { error: insertError } = await supabase
      .from('chats')
      .insert([{ chat_uuid: chatUuid, char_uuid: characterUuid, user_uuid: userUuid }]);

    if (insertError) {
      throw insertError;
    }

    return { chat_uuid: chatUuid };
  } catch (error) {
    const supabaseError = error as SupabaseError;
    return { error: supabaseError.message };
  }
}
