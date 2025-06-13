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

  const { data: tagLinks, error: tagError } = await supabase
    .from('tags')
    .select('char_uuid')
    .eq('tag_name', tag);

  if (tagError) throw new Error(tagError.message);
  if (!tagLinks || tagLinks.length === 0) return [];

  const charUuids = tagLinks.map(t => t.char_uuid);

  let query = supabase
    .from('characters')
    .select('*')
    .in('char_uuid', charUuids)
    .eq('is_nsfw', false)
    .order('chat_messages_count', { ascending: false })
    .range(offset, offset + maxCharacter - 1);

  if (gender === 'male' || gender === 'female') {
    query = query.eq('gender', gender);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data as Character[];
}
