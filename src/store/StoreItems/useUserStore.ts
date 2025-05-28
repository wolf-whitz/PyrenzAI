import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  userUUID: string | null;
  userIcon: string | null;
  subscription_plan: string[] | null;
  setUserUUID: (uuid: string) => void;
  setUserIcon: (icon: string) => void;
  setSubscriptionPlan: (plan: string[]) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userUUID: null,
      userIcon: null,
      subscription_plan: null,
      setUserUUID: (uuid) => set({ userUUID: uuid }),
      setUserIcon: (icon) => set({ userIcon: icon }),
      setSubscriptionPlan: (plan) => set({ subscription_plan: plan }),
    }),
    {
      name: 'user-storage',
    }
  )
);
