import { Utils } from '~/Utility';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

interface GetCharacterWithTagProps {
  maxCharacter: number;
  page: number;
  tag: string;
  gender?: string;
  searchQuery?: string;
  creatorUUID?: string;
  sortBy?: 'chat_messages_count' | 'created_at';
}

interface GetCharacterWithTagResponse {
  characters: Character[];
  totalItems: number;
  totalPages: number;
}

export async function getCharacterWithTag({
  maxCharacter,
  page,
  tag,
  gender,
  searchQuery,
  creatorUUID,
  sortBy = 'chat_messages_count',
}: GetCharacterWithTagProps): Promise<GetCharacterWithTagResponse> {
  const { show_nsfw = true, blocked_tags = [] } = useUserStore.getState();

  const bannedUserRes = await Utils.db.select<{ user_uuid: string }>({
    tables: 'banned_users',
    columns: 'user_uuid',
  });
  const bannedUserUUIDs = (bannedUserRes.data ?? [])
    .map((u) => u.user_uuid)
    .filter(Boolean);

  const match: Record<string, any> = {
    ...(searchQuery ? { name: `%${searchQuery.trim()}%` } : {}),
    ...(gender ? { gender: gender.trim() } : {}),
    ...(creatorUUID ? { creator_uuid: creatorUUID.trim() } : {}),
    ...(show_nsfw ? {} : { is_nsfw: false }),
  };

  const filters = [
    { column: 'is_banned', operator: 'eq', value: false },
    ...(tag
      ? [{ column: 'tags', operator: 'overlaps', value: [tag.trim()] }]
      : []),
    ...(blocked_tags.length
      ? [
          {
            column: 'tags',
            operator: 'not_overlaps',
            value: blocked_tags.map((t) => t.trim()),
          },
        ]
      : []),
    ...(bannedUserUUIDs.length
      ? [{ column: 'creator_uuid', operator: 'not_in', value: bannedUserUUIDs }]
      : []),
  ];

  const { data = [], count } = await Utils.db.select<Character>({
    tables: 'public_characters',
    columns: '*',
    countOption: 'exact',
    match,
    orderBy: { column: sortBy, ascending: false },
    extraFilters: filters,
    paging: false,
  });

  const filtered = data.filter((char) => {
    if (!show_nsfw && char.is_nsfw) return false;
    if (bannedUserUUIDs.includes(char.creator_uuid)) return false;
    if (gender && char.gender !== gender) return false;
    if (creatorUUID && char.creator_uuid !== creatorUUID) return false;
    if (tag && !char.tags?.includes(tag)) return false;
    if (blocked_tags.length && char.tags?.some((t) => blocked_tags.includes(t)))
      return false;
    return true;
  });

  const totalItems = count ?? filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / maxCharacter));
  const start = (page - 1) * maxCharacter;
  const end = page * maxCharacter;

  const characters = filtered.slice(start, end).map((char) => ({
    ...char,
    id: char.id,
  }));

  return {
    characters,
    totalItems,
    totalPages,
  };
}
