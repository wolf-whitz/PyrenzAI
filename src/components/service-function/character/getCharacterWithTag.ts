import { Utils } from '~/Utility';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';
import type { ExtraFilter } from '@sdk/Types';

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

  const bannedUserRes = await Utils.db.select<{ user_uuid: string }>(
    'banned_users',
    'user_uuid'
  );

  const bannedUserUUIDs = bannedUserRes.data.map((u) => u.user_uuid).filter(Boolean);

  const match: Record<string, any> = {};
  if (searchQuery) match.name = `%${searchQuery.trim()}%`;
  if (!show_nsfw) match.is_nsfw = false;
  if (gender) match.gender = gender.trim();
  if (creatorUUID) match.creator_uuid = creatorUUID.trim();

  const from = (page - 1) * maxCharacter;
  const to = from + maxCharacter - 1;

  const extraFilters: ExtraFilter[] = [
    ...(tag ? [{ column: 'tags', operator: 'in', value: [tag.trim()] }] : []),
    ...(blocked_tags.length > 0
      ? [{ column: 'tags', operator: 'not_overlaps', value: blocked_tags }]
      : []),
    ...(bannedUserUUIDs.length > 0
      ? [{ column: 'creator_uuid', operator: 'not_in', value: bannedUserUUIDs }]
      : []),
    { column: 'is_banned', operator: 'eq', value: false },
  ];

  const { data: characters = [] } = await Utils.db.select<Character>(
    'public_characters',
    '*',
    'exact',
    match,
    { from, to },
    { column: sortBy, ascending: false },
    extraFilters
  );

  return characters.map((char) => ({
    ...char,
    id: String(char.id),
  }));
}
