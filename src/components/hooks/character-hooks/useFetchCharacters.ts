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
  show_nsfw: boolean;
}

export function useFetchCharacters({
  currentPage,
  search,
  itemsPerPage,
  t,
  show_nsfw,
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
      const response = await fetchCharacters({
        currentPage,
        itemsPerPage,
        search: search || '',
        showNsfw: show_nsfw,
      });

      const safeCharacters = response.map((char: Character) => char);

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
    show_nsfw,
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
