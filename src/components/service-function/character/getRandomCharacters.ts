import { Utils } from '~/Utility';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

type SortBy = 'created_at' | 'chat_messages_count' | null;

export async function getRandomCharacters(
  type: string,
  maxCharacter: number,
  page: number,
  sortBy: SortBy = null
): Promise<{ characters: Character[]; totalPages: number }> {
  if (type !== 'random') throw new Error('Invalid type');

  const { show_nsfw = true, blocked_tags = [] } = useUserStore.getState();
  const fetchLimit = maxCharacter * 10;

  const bannedUserRes = await Utils.db.select<{ user_uuid: string }>({
    tables: 'banned_users',
    columns: 'user_uuid',
  });

  const bannedUserUUIDs = (bannedUserRes.data ?? [])
    .map((u) => u.user_uuid)
    .filter(Boolean);

  const match: Record<string, any> = {};
  if (!show_nsfw) match.is_nsfw = false;

  const extraFilters = [
    ...(blocked_tags.length > 0
      ? [{ column: 'tags', operator: 'not_overlaps', value: blocked_tags }]
      : []),
    ...(bannedUserUUIDs.length > 0
      ? [{ column: 'creator_uuid', operator: 'not_in', value: bannedUserUUIDs }]
      : []),
    { column: 'is_banned', operator: 'eq', value: false },
  ];

  const { data: allCharacters = [] } = await Utils.db.select<Character>({
    tables: 'public_characters',
    columns: '*',
    countOption: 'exact',
    match,
    range: { from: 0, to: fetchLimit - 1 },
    orderBy: sortBy ? { column: sortBy, ascending: false } : undefined,
    extraFilters,
    paging: false,
  });

  const shuffled = allCharacters.sort(() => 0.5 - Math.random());
  const startIndex = (page - 1) * maxCharacter;
  const endIndex = startIndex + maxCharacter;
  const paged = shuffled.slice(startIndex, endIndex);

  return {
    characters: paged.map((char) => char),
    totalPages: Math.ceil(shuffled.length / maxCharacter),
  };
}
