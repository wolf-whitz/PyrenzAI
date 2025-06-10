import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  userUUID: string | null;
  userIcon: string | null;
  subscription_plan: string[] | null;
  imageURL: string | null;
  setUserUUID: (uuid: string) => void;
  setUserIcon: (icon: string) => void;
  setSubscriptionPlan: (plan: string[]) => void;
  setImageURL: (url: string | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userUUID: null,
      userIcon: null,
      subscription_plan: null,
      imageURL: null,
      setUserUUID: (uuid) => set({ userUUID: uuid }),
      setUserIcon: (icon) => set({ userIcon: icon }),
      setSubscriptionPlan: (plan) => set({ subscription_plan: plan }),
      setImageURL: (url) => set({ imageURL: url }),
    }),
    {
      name: 'user-storage',
    }
  )
);
