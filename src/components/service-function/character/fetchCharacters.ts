import { Utils } from '~/Utility';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';
import { useHomeStore } from '~/store';

interface FetchCharactersProps {
  currentPage: number;
  itemsPerPage: number;
  search?: string;
  charuuid?: string;
  showNsfw?: boolean;
  genderFilter?: string;
  tags?: string[];
  creatoruuid?: string;
  sortBy?: 'created_at' | 'chat_messages_count';
  blockedTags?: string[];
}

interface FetchCharactersResponse {
  characters: Character[];
  totalItems: number;
  totalPages: number;
}

export async function fetchCharacters({
  currentPage = 1,
  itemsPerPage = 50,
  search,
  charuuid,
  showNsfw = true,
  genderFilter,
  tags = [],
  creatoruuid,
  sortBy = 'chat_messages_count',
  blockedTags = [],
}: FetchCharactersProps): Promise<FetchCharactersResponse> {
  const { setCurrentPage, setMaxPage } = useHomeStore.getState();

  try {
    const bannedUserRes = await Utils.db.select<{ user_uuid: string }>({
      tables: 'banned_users',
      columns: 'user_uuid',
    });

    const bannedUserUUIDs = bannedUserRes.data
      .map((u) => u.user_uuid)
      .filter(Boolean);

    const match: Record<string, any> = {};
    if (search) match.name = `%${search.trim()}%`;
    if (charuuid) match.char_uuid = charuuid.trim();
    if (!showNsfw) match.is_nsfw = false;
    if (genderFilter) match.gender = genderFilter.trim();
    if (creatoruuid) match.creator_uuid = creatoruuid.trim();

    const baseFilters = [];

    if (tags.length > 0) {
      baseFilters.push({ column: 'tags', operator: 'in', value: tags });
    }

    if (blockedTags.length > 0) {
      baseFilters.push({
        column: 'tags',
        operator: 'not_overlaps',
        value: blockedTags,
      });
    }

    if (bannedUserUUIDs.length > 0) {
      baseFilters.push({
        column: 'creator_uuid',
        operator: 'not_in',
        value: bannedUserUUIDs,
      });
    }

    const orderBy = { column: sortBy, ascending: false };

    const result = await Utils.db.select<Character>({
      tables: ['public_characters', 'private_characters'],
      columns: '*',
      countOption: 'exact',
      match,
      orderBy,
      extraFilters: baseFilters,
      paging: false,
    });

    const filtered = result.data.filter((char) => {
      if (char.is_nsfw && !showNsfw) return false;
      if (bannedUserUUIDs.includes(char.creator_uuid)) return false;
      if (genderFilter && char.gender !== genderFilter) return false;
      if (creatoruuid && char.creator_uuid !== creatoruuid) return false;
      if (tags.length && !tags.some((tag) => char.tags?.includes(tag)))
        return false;
      if (
        blockedTags.length &&
        char.tags?.some((tag) => blockedTags.includes(tag))
      )
        return false;
      if ('is_banned' in char && (char as any).is_banned === true) return false;
      return true;
    });

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;

    const characters = filtered.slice(start, end).map((char) => ({
      ...char,
      id: char.id,
    }));

    setCurrentPage(currentPage);
    setMaxPage(totalPages);

    return {
      characters,
      totalItems,
      totalPages,
    };
  } catch (err) {
    if (err instanceof Error) {
      Sentry.captureException(err);
    } else {
      Sentry.captureMessage('An unknown error occurred.');
    }

    setCurrentPage(1);
    setMaxPage(1);

    return {
      characters: [],
      totalItems: 0,
      totalPages: 1,
    };
  }
}
