import { Utils } from '~/Utility';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

type SortBy = 'created_at' | 'chat_messages_count';

interface CharacterDataResponse {
  characters: Character[];
}

export async function getLatestCharacter(
  type: string,
  maxCharacter: number,
  page: number,
  sortBy: SortBy = 'created_at'
): Promise<Character[]> {
  if (type !== 'latest') {
    throw new Error('Invalid type');
  }

  const { show_nsfw = true, blocked_tags = [] } = useUserStore.getState();

  const data = (await Utils.db.rpc('get_filtered_characters', {
    page,
    items_per_page: maxCharacter,
    show_nsfw,
    blocked_tags: blocked_tags.length ? blocked_tags : [],
    sort_by: sortBy,
    gender_filter: null,
    search: null,
    tag: [],
    creatoruuid: null,
    charuuid: null,
  })) as CharacterDataResponse;

  if (!data) {
    throw new Error('Failed to fetch latest characters');
  }

  const characters = (data.characters ?? []).map((char: any) => ({
    ...char,
    id: String(char.id),
  }));

  return characters;
}
