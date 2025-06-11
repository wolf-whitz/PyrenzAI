import { useCallback, useEffect } from 'react';
import { fetchCharacters } from '@components';
import { usePyrenzAlert } from '~/provider';
import type { Character } from '@shared-types';
import { useHomeStore } from '~/store';

interface UseFetchCharactersProps {
  currentPage: number;
  search: string;
  itemsPerPage: number;
  t: (key: string) => string;
}

export function useFetchCharacters({
  currentPage,
  search,
  itemsPerPage,
  t,
}: UseFetchCharactersProps) {
  const showAlert = usePyrenzAlert();
  const {
    loading,
    setLoading,
    characters,
    setCharacters,
    maxPage,
    setMaxPage,
  } = useHomeStore();

  const fetchCharactersData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCharacters(
        'character',
        currentPage,
        itemsPerPage,
        search || ' ',
        setMaxPage
      );

      const safeCharacters = response.characters.map((char: Character) => char);

      setCharacters(safeCharacters);
    } catch (error) {
      showAlert(t('errors.fetchingCharacters'), 'Alert');
      setCharacters([]);
      setMaxPage(0);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    search,
    itemsPerPage,
    t,
    setLoading,
    setCharacters,
    setMaxPage,
  ]);

  useEffect(() => {
    fetchCharactersData();
  }, [fetchCharactersData]);

  const isLoadingMaxPage = loading || maxPage === 0 || maxPage == null;

  return {
    characters,
    loading: isLoadingMaxPage,
    maxPage,
  };
}
