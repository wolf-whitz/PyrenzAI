import { create } from 'zustand';

interface UserState {
  captcha_uuid: string | null;
  captcha_expiration: number | null;
  hasHydrated: boolean;
  setCaptcha: (token: string, expiration: number) => void;
  clearCaptcha: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  captcha_uuid: null,
  captcha_expiration: null,
  hasHydrated: false,
  setCaptcha: (token: string, expiration: number) =>
    set({ captcha_uuid: token, captcha_expiration: expiration }),
  clearCaptcha: () => set({ captcha_uuid: null, captcha_expiration: null }),
  setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
}));
