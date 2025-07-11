import { supabase } from '~/Utility';
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
    let character;
    const { data: publicCharacter, error: publicFetchError } = await supabase
      .from('public_characters')
      .select('*')
      .eq('char_uuid', characterUuid)
      .single<Character>();

    if (!publicFetchError && publicCharacter) {
      character = publicCharacter;
    } else {
      const { data: privateCharacter, error: privateFetchError } =
        await supabase
          .from('private_characters')
          .select('*')
          .eq('char_uuid', characterUuid)
          .single<Character>();

      if (privateFetchError || !privateCharacter) {
        throw privateFetchError || new Error('Character not found');
      }
      character = privateCharacter;
    }

    const {
      model_instructions,
      name,
      persona,
      description,
      profile_image,
      lorebook,
      scenario, // Ensure scenario is included
    } = character;

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
        scenario,
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
