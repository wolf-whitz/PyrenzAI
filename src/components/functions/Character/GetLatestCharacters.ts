import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';

export async function GetLatestCharacters(
  type: string,
  maxCharacter: number,
  page: number
): Promise<Character[]> {
  if (type === 'GetLatestCharacter') {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('is_nsfw', false)
      .order('created_at', { ascending: false })
      .limit(maxCharacter)
      .range((page - 1) * maxCharacter, page * maxCharacter - 1);

    if (error) {
      throw new Error(error.message);
    }

    return data as Character[];
  } else {
    throw new Error('Invalid type');
  }
}
