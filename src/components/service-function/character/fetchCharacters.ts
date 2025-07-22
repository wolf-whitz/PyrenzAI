import { Utils } from '~/Utility';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';

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

export async function fetchCharacters({
  currentPage = 1,
  itemsPerPage = 20,
  search,
  charuuid,
  showNsfw = true,
  genderFilter,
  tags = [],
  creatoruuid,
  sortBy = 'chat_messages_count',
  blockedTags = [],
}: FetchCharactersProps): Promise<Character[]> {
  try {
    const bannedUserRes = await Utils.db.select<{ user_uuid: string }>(
      'banned_users',
      'user_uuid'
    );

    const bannedUserUUIDs = bannedUserRes.data
      .map((u) => u.user_uuid)
      .filter(Boolean);

    const match: Record<string, any> = {};
    if (search) match.name = `%${search.trim()}%`;
    if (charuuid) match.char_uuid = charuuid.trim();
    if (!showNsfw) match.is_nsfw = false;
    if (genderFilter) match.gender = genderFilter.trim();
    if (creatoruuid) match.creator_uuid = creatoruuid.trim();

    const baseFilters: {
      column: string;
      operator: 'in' | 'not_overlaps' | 'not_in' | 'eq';
      value: any;
    }[] = [];

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

    const range = {
      from: (currentPage - 1) * itemsPerPage,
      to: currentPage * itemsPerPage - 1,
    };

    const orderBy = {
      column: sortBy,
      ascending: false,
    };

    const result = await Promise.all(
      ['public_characters', 'private_characters'].map(async (table) => {
        const extraFilters = [...baseFilters];

        if (table === 'public_characters') {
          extraFilters.push({
            column: 'is_banned',
            operator: 'eq',
            value: false,
          });
        }

        const { pages } = await Utils.db.select<Character>(
          table,
          '*',
          'exact',
          match,
          range,
          orderBy,
          extraFilters,
          true
        );

        return pages?.[0] ?? [];
      })
    );

    const merged = result.flat().filter((char) => char != null);

    return merged.map((char) => ({
      ...char,
      id: String(char.id),
    }));
  } catch (err) {
    console.error('Character fetch error:', err);
    if (err instanceof Error) {
      Sentry.captureException(err);
    } else {
      Sentry.captureMessage('An unknown error occurred.');
    }
    return [];
  }
}
