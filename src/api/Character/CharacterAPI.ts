import { Character } from '@shared-types';
import * as Sentry from '@sentry/react';
import { fetchCharacters as fetchCharactersFunction } from '@components';
import { useHomeStore } from '~/store';

const setMaxPageInStore = (maxPage: number) => {
  const { setMaxPage } = useHomeStore.getState();
  setMaxPage(maxPage);
};

export const fetchCharacters = async (
  currentPage: number,
  itemsPerPage: number,
  search: string
): Promise<{
  characters: Character[];
}> => {
  try {
    const data = await fetchCharactersFunction(
      'character',
      currentPage,
      itemsPerPage,
      search,
    );

    if (!data || !data.characters || data.characters.length === 0) {
      console.log('No characters found in the API response.');
      setMaxPageInStore(0);
      return {
        characters: [],
      };
    }

    return {
      characters: data.characters,
    };
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage('An unknown error occurred.');
    }
    setMaxPageInStore(0);
    return {
      characters: [],
    };
  }
};
