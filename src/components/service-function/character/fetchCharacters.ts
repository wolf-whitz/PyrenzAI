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

interface FetchCharactersResponse {
  character: Character | null;
  characters: Character[];
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
}: FetchCharactersProps): Promise<FetchCharactersResponse> {
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

    const { data } = await Utils.db.selectFirstAvailable<Character>(
      ['public_characters', 'private_characters'],
      match,
      '*',
      'exact',
      range,
      orderBy,
      (tableName) => {
        const filters = [...baseFilters].filter((f) => {
          if (
            (f.operator === 'in' || f.operator === 'not_in' || f.operator === 'not_overlaps') &&
            (!Array.isArray(f.value) || f.value.length === 0)
          ) {
            return false;
          }
          return true;
        });
        if (tableName === 'public_characters') {
          filters.push({ column: 'is_banned', operator: 'eq', value: false });
        }
        return filters;
      }
    );

    const normalized: Character[] = Array.isArray(data) ? data : data ? [data] : [];
    const mappedCharacters: Character[] = normalized.map((char) => ({
      ...char,
      id: String(char.id),
    }));

    let selectedCharacter: Character | null = null;
    if (mappedCharacters.length > 0) {
      const highestCount = Math.max(
        ...mappedCharacters.map((c) => c.chat_messages_count || 0)
      );
      const topCharacters = mappedCharacters.filter(
        (c) => c.chat_messages_count === highestCount
      );
      selectedCharacter =
        topCharacters.length === 1
          ? topCharacters[0]
          : topCharacters.sort((a, b) =>
              String(a.id).localeCompare(String(b.id))
            )[0];
    }

    return {
      character: selectedCharacter,
      characters: mappedCharacters,
    };
  } catch (err) {
    if (err instanceof Error) {
      Sentry.captureException(err);
    } else {
      Sentry.captureMessage('An unknown error occurred.');
    }
    return {
      character: null,
      characters: [],
    };
  }
}
