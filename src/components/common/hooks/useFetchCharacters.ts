import { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchCharacters } from '~/api';

interface UseFetchCharactersProps {
  currentPage: number;
  search: string;
  itemsPerPage: number;
  userUUID: string | null;
  setCharacters: (characters: any[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  t: (key: string) => string;
}

export default function useFetchCharacters({
  currentPage,
  search,
  itemsPerPage,
  userUUID,
  setCharacters,
  setTotal,
  setLoading,
  t,
}: UseFetchCharactersProps) {
  const fetchCharactersData = useCallback(async () => {
    if (!userUUID) return;

    setLoading(true);
    try {
      const { characters, total } = await fetchCharacters(
        currentPage,
        itemsPerPage,
        search
      );
      setCharacters(characters);
      setTotal(total);
    } catch (error) {
      toast.error(t('errors.fetchingCharacters'));
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    search,
    itemsPerPage,
    userUUID,
    setCharacters,
    setTotal,
    setLoading,
    t,
  ]);

  useEffect(() => {
    fetchCharactersData();
  }, [fetchCharactersData]);
}
