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
  tag?: string;
}

export function useFetchCharacters({
  currentPage,
  search,
  itemsPerPage,
  t,
  tag,
}: UseFetchCharactersProps) {
  const showAlert = usePyrenzAlert();
  const {
    loading,
    setLoading,
    characters,
    setCharacters,
    maxPage,
    setMaxPage,
    currentPage: currentPageFromStore,
  } = useHomeStore();

  const fetchCharactersData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCharacters({
        currentPage,
        itemsPerPage,
        sortBy: 'chat_messages_count',
        search,
        tagsFilter: tag ? [tag] : null,
      });

      const safeCharacters = response.characters.map((char: Character) => char);
      setCharacters(safeCharacters);

      const newMaxPage = Math.ceil(response.totalItems / itemsPerPage) || 1;
      setMaxPage(newMaxPage);
    } catch (error) {
      showAlert(t('errors.fetchingCharacters'), 'Alert');
      setCharacters([]);
      setMaxPage(1);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    search,
    itemsPerPage,
    t,
    tag,
    setLoading,
    setCharacters,
    setMaxPage,
    showAlert,
  ]);

  useEffect(() => {
    fetchCharactersData();
  }, [fetchCharactersData]);

  const isLoadingMaxPage = loading || maxPage === 0 || maxPage == null;

  return {
    characters,
    loading: isLoadingMaxPage,
    totalPages: maxPage || 1,
    currentPage: currentPageFromStore || 1,
  };
}
