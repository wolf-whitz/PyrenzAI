import { useCallback, useEffect } from 'react';
import { fetchCharacters } from '~/api';
import { usePyrenzAlert } from '~/provider';

interface UseFetchCharactersProps {
  currentPage: number;
  search: string;
  itemsPerPage: number;
  setCharacters: (characters: any[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  t: (key: string) => string;
}

export function useFetchCharacters({
  currentPage,
  search,
  itemsPerPage,
  setCharacters,
  setTotal,
  setLoading,
  t,
}: UseFetchCharactersProps) {
  const showAlert = usePyrenzAlert();

  const fetchCharactersData = useCallback(async () => {
    setLoading(true);
    try {
      const { characters, total, isOwner } = await fetchCharacters(
        currentPage,
        itemsPerPage,
        search
      );
      setCharacters(characters);
      setTotal(total);
      return { isOwner };
    } catch (error) {
      showAlert(t('errors.fetchingCharacters'), 'Alert');
      return { isOwner: false };
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    search,
    itemsPerPage,
    setCharacters,
    setTotal,
    setLoading,
    t,
  ]);

  useEffect(() => {
    fetchCharactersData();
  }, [fetchCharactersData]);

  return { isOwner: false };
}
