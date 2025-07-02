import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

type SortBy = 'created_at' | 'chat_messages_count' | null;

export async function GetRandomCharacters(
  type: string,
  maxCharacter: number,
  page: number,
  sortBy: SortBy = null
): Promise<Character[]> {
  if (type !== 'random') {
    throw new Error('Invalid type');
  }

  const { show_nsfw = true, blocked_tags = [] } = useUserStore.getState();

  const fetchLimit = maxCharacter * 10;

  const { data, error } = await supabase.rpc('get_filtered_characters', {
    page: 1,
    items_per_page: fetchLimit,
    show_nsfw,
    blocked_tags: blocked_tags.length ? blocked_tags : [],
    sort_by: sortBy,
    gender_filter: null,
    search: null,
    tag: [],
    creatoruuid: null,
  });

  if (error) {
    throw new Error(`Failed to fetch random characters: ${error.message}`);
  }

  const characters = (data?.characters ?? []).map((char: any) => ({
    ...char,
    id: String(char.id),
  }));

  if (characters.length === 0) return [];

  const shuffledCharacters = characters.sort(() => 0.5 - Math.random());

  const startIndex = (page - 1) * maxCharacter;
  const endIndex = startIndex + maxCharacter;

  return shuffledCharacters.slice(startIndex, endIndex);
}
