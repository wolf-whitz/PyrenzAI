import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

export async function GetRandomCharacters(
  type: string,
  maxCharacter: number,
  page: number
): Promise<Character[]> {
  if (type !== 'random') {
    throw new Error('Invalid type');
  }

  const { show_nsfw, blocked_tags } = useUserStore.getState();

  const fetchLimit = maxCharacter * 10;
  const { data, error } = await supabase.rpc('get_filtered_characters', {
    page: 1,
    items_per_page: fetchLimit,
    show_nsfw,
    blocked_tags: blocked_tags || [],
    sort_by: null,
    gender_filter: null,
    search: null,
    tag: [],
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data || !data.characters || data.characters.length === 0) {
    return [];
  }

  const shuffledCharacters = data.characters.sort(() => 0.5 - Math.random());

  const startIndex = (page - 1) * maxCharacter;
  const endIndex = startIndex + maxCharacter;
  const randomCharacters = shuffledCharacters.slice(startIndex, endIndex);

  return randomCharacters as Character[];
}
