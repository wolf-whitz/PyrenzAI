import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

type SortBy = 'created_at' | 'chat_messages_count';

export async function GetLatestCharacters(
  type: string,
  maxCharacter: number,
  page: number,
  sortBy: SortBy = 'created_at'
): Promise<Character[]> {
  if (type !== 'latest') {
    throw new Error('Invalid type');
  }

  const { show_nsfw = true, blocked_tags = [] } = useUserStore.getState();

  const { data, error } = await supabase.rpc('get_filtered_characters', {
    page,
    items_per_page: maxCharacter,
    show_nsfw,
    blocked_tags: blocked_tags.length ? blocked_tags : [],
    sort_by: sortBy,
    gender_filter: null,
    search: null,
    tag: [],
    creatoruuid: null,
  });

  if (error) {
    throw new Error(`Failed to fetch latest characters: ${error.message}`);
  }

  const characters: Character[] = (data?.characters ?? []).map((char: any) => ({
    ...char,
    id: String(char.id),
  }));

  return characters;
}
