import { create } from 'zustand'
import { CharacterCardProps } from '@shared-types/CharacterProp'

interface StoreState {
  search: string
  currentPage: number
  characters: CharacterCardProps[]
  total: number
  loading: boolean
  bgImage: string | null
  setSearch: (search: string) => void
  setCurrentPage: (page: number) => void
  setCharacters: (characters: CharacterCardProps[]) => void
  setTotal: (total: number) => void
  setLoading: (loading: boolean) => void
  setBgImage: (imageUrl: string | null) => void
}

export const useHomeStore = create<StoreState>((set) => ({
  search: '',
  currentPage: 1,
  characters: [],
  total: 0,
  loading: true,
  bgImage: null,

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

  setBgImage: (imageUrl) => set(() => ({ bgImage: imageUrl })),
}))
