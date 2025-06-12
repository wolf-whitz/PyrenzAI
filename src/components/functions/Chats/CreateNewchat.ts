import { supabase } from '~/Utility/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Character } from '@shared-types';

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

export async function CreateNewChat(
  characterUuid: string,
  userUUID: string
): Promise<CreateChatResponse> {
  const chatUuid = uuidv4();

  try {
    const { data: Character, error: fetchError } = await supabase
      .from('characters')
      .select('*')
      .eq('char_uuid', characterUuid)
      .single<Character>();

    if (fetchError) {
      throw fetchError;
    }

    const { model_instructions, name, persona, description, profile_image, lorebook } =
      Character;

    const { error: insertError } = await supabase.from('chats').insert([
      {
        chat_uuid: chatUuid,
        char_uuid: characterUuid,
        user_uuid: userUUID,
        preview_image: profile_image,
        preview_message: description,
        model_instructions,
        name,
        lorebook,
        persona,
      },
    ]);

    if (insertError) {
      throw insertError;
    }

    return { chat_uuid: chatUuid };
  } catch (error) {
    const supabaseError = error as SupabaseError;
    return { error: supabaseError.message };
  }
}
