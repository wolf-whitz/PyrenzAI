import { create } from 'zustand';
import { Character } from '@shared-types/CharacterProp';

interface StoreState {
  search: string;
  currentPage: number;
  characters: Character[];
  total: number;
  loading: boolean;
  setSearch: (search: string) => void;
  setCurrentPage: (page: number) => void;
  setCharacters: (characters: Character[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useHomeStore = create<StoreState>((set) => ({
  search: '',
  currentPage: 1,
  characters: [],
  total: 0,
  loading: false,

  setSearch: (search) =>
    set(() => ({
      search,
      currentPage: 1,
      characters: [],
    })),

  setCurrentPage: (page) =>
    set(() => ({
      currentPage: page,
      characters: [],
    })),

  setCharacters: (characters) => set(() => ({ characters })),

  setTotal: (total) => set(() => ({ total })),

  setLoading: (loading) =>
    set(() => ({
      loading,
      characters: loading ? [] : undefined,
    })),
}));
