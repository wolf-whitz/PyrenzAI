import { supabase } from '~/Utility';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

type SortBy = 'chat_messages_count' | 'created_at';

export async function getCharacterWithTag(
  maxCharacter: number,
  page: number,
  type: string,
  tag: string,
  gender?: string,
  searchQuery?: string,
  creatorUUID?: string,
  sortBy: SortBy = 'chat_messages_count'
): Promise<Character[]> {
  if (type !== 'tags') {
    throw new Error('Invalid type: must be "tags"');
  }

  const { show_nsfw = true, blocked_tags = [] } = useUserStore.getState();

  const { data, error } = await supabase.rpc('get_filtered_characters', {
    page,
    items_per_page: maxCharacter,
    search: searchQuery?.trim() || null,
    show_nsfw: show_nsfw ?? true,
    blocked_tags: blocked_tags.length ? blocked_tags : [],
    gender_filter: gender?.trim() || null,
    tag: tag?.trim() ? [tag.trim()] : [],
    creatoruuid: creatorUUID?.trim() || null,
    sort_by: sortBy,
    charuuid: null,
  });

  if (error) {
    throw new Error(`Failed to fetch characters: ${error.message}`);
  }

  const characters: Character[] = (data?.characters ?? []).map((char: any) => ({
    ...char,
    id: String(char.id),
  }));

  return characters;
}
