import { supabase } from '~/Utility/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

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
  userUUID: string,
  profileImage: string,
  description: string
): Promise<CreateChatResponse> {
  const chatUuid = uuidv4();

  try {
    const { error: insertError } = await supabase.from('chats').insert([
      {
        chat_uuid: chatUuid,
        char_uuid: characterUuid,
        user_uuid: userUUID,
        preview_image: profileImage,
        preview_message: description,
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
