import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  userUUID: string | null;
  userIcon: string | null;
  setUserUUID: (uuid: string) => void;
  setUserIcon: (icon: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userUUID: null,
      userIcon: null,
      setUserUUID: (uuid) => set({ userUUID: uuid }),
      setUserIcon: (icon) => set({ userIcon: icon }),
    }),
    {
      name: 'user-storage',
    }
  )
);
