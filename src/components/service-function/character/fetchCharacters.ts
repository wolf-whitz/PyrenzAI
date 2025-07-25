import { Utils } from '~/Utility';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';
import { useHomeStore, useUserStore } from '~/store';

interface FetchCharactersProps {
  currentPage: number;
  itemsPerPage: number;
  genderFilter?: string | null;
  tagsFilter?: string[] | null;
  sortBy?: string;
  filterCreatorUUID?: string | null;
  filterCharUUID?: string | null;
}

interface FetchCharactersResponse {
  characters: Character[];
  totalItems: number;
  totalPages: number;
}

export async function fetchCharacters({
  currentPage = 1,
  itemsPerPage = 20,
  genderFilter = null,
  tagsFilter = null,
  sortBy = 'id',
  filterCreatorUUID = null,
  filterCharUUID = null,
}: FetchCharactersProps): Promise<FetchCharactersResponse> {
  const { setCurrentPage, setMaxPage } = useHomeStore.getState();
  const { blocked_tags, show_nsfw } = useUserStore.getState();

  try {
    const bannedRes = await Utils.db.select<{ user_uuid: string }>({
      tables: 'banned_users',
      columns: 'user_uuid',
    });

    const bannedCreatorUUIDs = bannedRes.data?.map((user) => user.user_uuid) ?? [];

    const result = await Utils.db.rpc<{
      total_count: number;
      total_pages: number;
      characters: Character[];
    }>({
      func: 'get_characters',
      params: {
        limit_val: itemsPerPage,
        page_num: currentPage,
        show_nsfw,
        gender_filter: genderFilter,
        tags_filter: tagsFilter,
        blocked_tags,
        sort_by: sortBy,
        filter_creator_uuid: filterCreatorUUID,
        filter_char_uuid: filterCharUUID,
      },
    });

    const totalItems = result.total_count ?? 0;
    const totalPages = result.total_pages ?? 1;

    const filteredCharacters = (result.characters ?? []).filter((char) => {
      return !char.is_banned && !bannedCreatorUUIDs.includes(char.creator_uuid);
    });

    setCurrentPage(currentPage);
    setMaxPage(totalPages);

    return {
      characters: filteredCharacters,
      totalItems,
      totalPages,
    };
  } catch (err) {
    if (err instanceof Error) {
      Sentry.captureException(err);
    } else {
      Sentry.captureMessage('An unknown error occurred in fetchCharacters.');
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
