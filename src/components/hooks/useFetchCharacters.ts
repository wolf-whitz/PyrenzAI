import { useCallback, useEffect } from 'react';
import { fetchCharacters } from '~/api';
import { usePyrenzAlert } from '~/provider';
import type { Character } from '@shared-types/CharacterProp';
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
    total,
    setTotal,
    isOwner,
    setIsOwner,
    maxPage,
    setMaxPage
  } = useHomeStore();

  const fetchCharactersData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCharacters(currentPage, itemsPerPage, search);

      const safeCharacters = response.characters.map((char: Character) => ({
        ...char,
        is_public: char.is_public ?? false,
        is_nsfw: char.is_nsfw ?? false,
        token_total: char.token_total ?? 0,
        isLoading: false,
      }));

      setCharacters(safeCharacters);
      setTotal(response.total);
      setIsOwner(response.isOwner);
      setMaxPage(response.maxPage);
    } catch (error) {
      showAlert(t('errors.fetchingCharacters'), 'Alert');
      setCharacters([]);
      setTotal(0);
      setIsOwner(false);
      setMaxPage(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, itemsPerPage, t, setLoading, setCharacters, setTotal, setIsOwner, setMaxPage]);

  useEffect(() => {
    fetchCharactersData();
  }, []); 

  return {
    characters,
    total,
    loading,
    isOwner,
    maxPage,
  };
}
