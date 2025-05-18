import { supabase } from '~/Utility/supabaseClient';

interface Character {
  id: number;
  input_char_uuid: string;
  name: string;
  description: string;
  first_message: string;
  profile_image: string;
  tags: string[];
  creator: string;
  chat_messages_count: number;
  is_public: boolean;
}

export async function GetRandomCharacters(
  type: string,
  maxCharacter: number,
  page: number
): Promise<Character[]> {
  if (type === 'GetRandomCharacter') {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('is_nsfw', false)
      .limit(maxCharacter * 10);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return [];
    }

    const shuffledCharacters = data.sort(() => 0.5 - Math.random());

    const startIndex = (page - 1) * maxCharacter;
    const endIndex = startIndex + maxCharacter;
    const randomCharacters = shuffledCharacters.slice(startIndex, endIndex);

    return randomCharacters as Character[];
  } else {
    throw new Error('Invalid type');
  }
}
