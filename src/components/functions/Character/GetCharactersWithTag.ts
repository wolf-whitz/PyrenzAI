import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';

export async function GetCharactersWithTags(
  maxCharacter: number,
  page: number,
  type: string,
  tag: string,
  gender?: string
): Promise<Character[]> {
  if (type !== 'GetTaggedCharacters') throw new Error('Invalid type');

  const offset = (page - 1) * maxCharacter;

  let query = supabase
    .from('characters')
    .select('*')
    .eq('is_nsfw', false)
    .order('chat_messages_count', { ascending: false })
    .range(offset, offset + maxCharacter - 1);

  if (gender === 'male' || gender === 'female') {
    query = query.eq('gender', gender);
  } else {
    query = query.contains('tags', JSON.parse(JSON.stringify([tag])));
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data as Character[];
}
