import { Utils } from '~/utility';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';
import { useHomeStore, useUserStore } from '~/store';

interface FetchCharactersProps {
  currentPage?: number;
  itemsPerPage?: number;
  genderFilter?: string | null;
  tagsFilter?: string[] | null;
  sortBy?: string;
  filterCreatorUUID?: string | null;
  filterCharUUID?: string | null;
  search?: string | null;
  showRecommended?: boolean;
}

interface FetchCharactersResponse {
  characters: Character[];
  totalItems: number;
  totalPages: number;
  recommendedCharacters: Character[];
}

export async function fetchCharacters({
  currentPage = 1,
  itemsPerPage = 20,
  genderFilter = null,
  tagsFilter = null,
  sortBy = 'id',
  filterCreatorUUID = null,
  filterCharUUID = null,
  search = null,
  showRecommended = false,
}: FetchCharactersProps): Promise<FetchCharactersResponse> {
  const { setCurrentPage, setMaxPage } = useHomeStore.getState();
  const { blocked_tags, show_nsfw } = useUserStore.getState();

  try {
    const result = await Utils.post<{
      total_count: number;
      total_pages: number;
      current_page: number;
      characters: Character[];
      recommended_characters?: Character[];
    }>('/api/Characters', {
      limit: itemsPerPage,
      page: currentPage,
      show_nsfw,
      gender: genderFilter,
      tags: tagsFilter,
      blocked_tags,
      sort_by: sortBy,
      filter_creator_uuid: filterCreatorUUID,
      filter_char_uuid: filterCharUUID,
      search,
      show_recommended: showRecommended,
    });

    const totalItems = result.total_count ?? 0;
    const totalPages = result.total_pages ?? 1;

    setCurrentPage(result.current_page ?? currentPage);
    setMaxPage(totalPages);

    return {
      characters: result.characters ?? [],
      totalItems,
      totalPages,
      recommendedCharacters: result.recommended_characters ?? [],
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
      recommendedCharacters: [],
    };
  }
}
