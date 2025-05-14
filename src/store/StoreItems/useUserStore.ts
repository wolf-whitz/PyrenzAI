import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  speechType: 'Puter' | 'Synthesis';
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      speechType: 'Synthesis',
    }),
    {
      name: 'user-store',
    }
  )
);
