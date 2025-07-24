import { Utils } from '~/Utility';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

type SortBy = 'chat_messages_count' | 'created_at';

interface GetHotCharacterResponse {
  characters: Character[];
  totalItems: number;
  totalPages: number;
}

export async function getHotCharacter(
  type: string,
  maxCharacter: number,
  page: number,
  sortBy: SortBy = 'chat_messages_count'
): Promise<GetHotCharacterResponse> {
  if (type !== 'hot') throw new Error('Invalid type');

  const { show_nsfw = true, blocked_tags = [] } = useUserStore.getState();

  const bannedUserRes = await Utils.db.select<{ user_uuid: string }>({
    tables: 'banned_users',
    columns: 'user_uuid',
  });

  const bannedUserUUIDs = (bannedUserRes.data ?? [])
    .map((u) => u.user_uuid)
    .filter(Boolean);

  const match: Record<string, any> = {};
  if (!show_nsfw) match.is_nsfw = false;

  const from = (page - 1) * maxCharacter;
  const to = from + maxCharacter - 1;

  const extraFilters = [
    ...(blocked_tags.length > 0
      ? [{ column: 'tags', operator: 'not_overlaps', value: blocked_tags }]
      : []),
    ...(bannedUserUUIDs.length > 0
      ? [{ column: 'creator_uuid', operator: 'not_in', value: bannedUserUUIDs }]
      : []),
    { column: 'is_banned', operator: 'eq', value: false },
  ];

  const { data = [], count } = await Utils.db.select<Character>({
    tables: 'public_characters',
    columns: '*',
    countOption: 'exact',
    match,
    range: { from, to },
    orderBy: { column: sortBy, ascending: false },
    extraFilters,
    paging: true,
  });

  const characters = data.map((char) => ({
    ...char,
    id: String(char.id),
  }));

  const totalItems = count ?? characters.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / maxCharacter));

  return {
    characters,
    totalItems,
    totalPages,
  };
}
