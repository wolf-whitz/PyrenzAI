import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchCharacters, useHandleCharacterFetchClick } from '@components';
import { useHomeStore } from '~/store';
import { usePyrenzAlert } from '~/provider';
import type { Character } from '@shared-types';

export const useHomepageAPI = (pageFromURL: number) => {
  const {
    search,
    setSearch,
    setCurrentPage: setStoreCurrentPage,
    setCharacters,
    setMaxPage,
  } = useHomeStore();

  const { t } = useTranslation();
  const itemsPerPage = 20;
  const usedCustomButton = useRef(false);

  const {
    characters,
    loading,
    currentPage: fetchedCurrentPage,
    totalPages,
  } = useFetchCharacters({
    currentPage: pageFromURL,
    search,
    itemsPerPage,
    t,
  });

  const fetchCharacterData = useHandleCharacterFetchClick();

  const onButtonTagClicked = async (tag: string) => {
    const res = await fetchCharacterData(
      'tags',
      itemsPerPage,
      pageFromURL,
      undefined,
      tag,
      undefined,
      search
    );
    setCharacters(res.characters);
    setMaxPage(res.totalPages);
  };

  return {
    search,
    characters,
    loading,
    currentPage: fetchedCurrentPage,
    totalPages,
    setSearch,
    setCurrentPage: (page: number) => {
      usedCustomButton.current = false;
      setStoreCurrentPage(page);
    },
    t,
    itemsPerPage,
    handleCharacterFetchClick: async (
      type: 'hot' | 'latest' | 'random' | 'tags',
      page: number,
      options?: {
        tag?: string;
        gender?: string;
      }
    ) => {
      const res = await fetchCharacterData(
        type,
        itemsPerPage,
        page,
        undefined,
        options?.tag,
        options?.gender,
        search
      );
      setCharacters(res.characters);
      setMaxPage(res.totalPages);
      usedCustomButton.current = true;
      setStoreCurrentPage(page);
    },
    onButtonTagClicked,
  };
};
