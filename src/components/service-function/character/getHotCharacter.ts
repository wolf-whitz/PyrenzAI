import { Utils } from '~/Utility';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

type SortBy = 'chat_messages_count' | 'created_at';

interface CharacterDataResponse {
  characters: Character[];
}

export async function getHotCharacter(
  type: string,
  maxCharacter: number,
  page: number,
  sortBy: SortBy = 'chat_messages_count'
): Promise<Character[]> {
  if (type !== 'hot') {
    throw new Error('Invalid type');
  }

  const { show_nsfw = true, blocked_tags = [] } = useUserStore.getState();

  const data = (await Utils.db.rpc('get_filtered_characters', {
    page,
    items_per_page: maxCharacter,
    show_nsfw: show_nsfw ?? true,
    blocked_tags: blocked_tags.length ? blocked_tags : [],
    gender_filter: null,
    search: null,
    tag: [],
    creatoruuid: null,
    sort_by: sortBy,
    charuuid: null,
  })) as CharacterDataResponse;

  if (!data) {
    throw new Error('Failed to fetch hot characters');
  }

  const characters = (data.characters ?? []).map((char: any) => ({
    ...char,
    id: String(char.id),
  }));

  return characters;
}
