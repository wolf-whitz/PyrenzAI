import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchCharacters } from '~/api';

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
      toast.error(t('errors.fetchingCharacters'));
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
