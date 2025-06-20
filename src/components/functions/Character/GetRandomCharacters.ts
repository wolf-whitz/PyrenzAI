import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

export async function GetRandomCharacters(
  type: string,
  maxCharacter: number,
  page: number
): Promise<Character[]> {
  if (type === 'random') {
    const { show_nsfw } = useUserStore.getState();

    let query = supabase
      .from('public_characters')
      .select('*')
      .limit(maxCharacter * 10);

    if (!show_nsfw) {
      query = query.eq('is_nsfw', false);
    }

    const { data, error } = await query;

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
