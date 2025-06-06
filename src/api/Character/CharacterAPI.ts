import { Character } from '@shared-types';
import * as Sentry from '@sentry/react';
import { fetchCharacters as fetchCharactersFunction } from '@components';

export const fetchCharacters = async (
  currentPage: number,
  itemsPerPage: number,
  search: string
): Promise<{
  characters: Character[];
  maxPage: number;
}> => {
  try {
    const data = await fetchCharactersFunction(
      'character',
      currentPage,
      itemsPerPage,
      search
    );

    if (!data || !data.characters || data.characters.length === 0) {
      console.log('No characters found in the API response.');
      return {
        characters: [],
        maxPage: 0,
      };
    }

    const totalCharacters = data.totalPages || 0;
    const maxPage = Math.ceil(totalCharacters / itemsPerPage);
    
    return {
      characters: data.characters,
      maxPage,
    };
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage('An unknown error occurred.');
    }
    return {
      characters: [],
      maxPage: 0,
    };
  }
};
