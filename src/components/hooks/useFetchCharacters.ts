import { useCallback, useEffect, useState } from 'react';
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
  const { loading, setLoading } = useHomeStore();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [total, setTotal] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [maxPage, setMaxPage] = useState(0);

  const fetchCharactersData = useCallback(async () => {
    setLoading(true);
    try {
      const { characters, total, isOwner, maxPage } = await fetchCharacters(
        currentPage,
        itemsPerPage,
        search
      );

      const safeCharacters = characters.map((char) => ({
        ...char,
        is_public: char.is_public ?? false,
        is_nsfw: char.is_nsfw ?? false,
        token_total: char.token_total ?? 0,
        isLoading: false,
      }));

      setCharacters(safeCharacters);
      setTotal(total);
      setIsOwner(isOwner);
      setMaxPage(maxPage);
    } catch (error) {
      showAlert(t('errors.fetchingCharacters'), 'Alert');
      setCharacters([]);
      setTotal(0);
      setIsOwner(false);
      setMaxPage(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, itemsPerPage, t, setLoading]);

  useEffect(() => {
    fetchCharactersData();
  }, [fetchCharactersData]);

  return {
    characters,
    total,
    setTotal,
    loading,
    isOwner,
    maxPage,
  };
}
