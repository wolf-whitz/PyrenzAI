import { create } from 'zustand';
import { Character } from '@shared-types/CharacterProp';

interface StoreState {
  search: string;
  currentPage: number;
  total: number;
  loading: boolean;
  isOwner: boolean;
  maxPage: number;
  characters: Character[];
  setSearch: (search: string) => void;
  setCurrentPage: (page: number) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setCharacters: (characters: Character[]) => void;
  setIsOwner: (isOwner: boolean) => void;
  setMaxPage: (maxPage: number) => void;
}

export const useHomeStore = create<StoreState>((set) => ({
  search: '',
  currentPage: 1,
  total: 0,
  loading: false,
  isOwner: false,
  maxPage: 0,
  characters: [],

  setSearch: (search) =>
    set(() => ({
      search,
      currentPage: 1,
    })),

  setCurrentPage: (page) =>
    set(() => ({
      currentPage: page,
    })),

  setTotal: (total) => set(() => ({ total })),

  setLoading: (loading) => set(() => ({ loading })),

  setCharacters: (characters) => set(() => ({ characters })),

  setIsOwner: (isOwner) => set(() => ({ isOwner })),

  setMaxPage: (maxPage) => set(() => ({ maxPage })),
}));
