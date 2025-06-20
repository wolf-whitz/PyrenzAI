import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

export async function GetLatestCharacters(
  type: string,
  maxCharacter: number,
  page: number
): Promise<Character[]> {
  if (type === 'latest') {
    const { show_nsfw } = useUserStore.getState();

    let query = supabase
      .from('public_characters')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(maxCharacter)
      .range((page - 1) * maxCharacter, page * maxCharacter - 1);

    if (!show_nsfw) {
      query = query.eq('is_nsfw', false);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data as Character[];
  } else {
    throw new Error('Invalid type');
  }
}
