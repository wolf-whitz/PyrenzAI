import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ModelIdentifier {
  name: string;
  model_description: string;
}

interface InferenceSettings {
  maxTokens: number;
  temperature: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
}

interface Customization {
  user_color: string;
  char_color: string;
  userTextColor: string;
  charTextColor: string;
  userItalicColor: string;
  charItalicColor: string;
  userQuotedColor: string;
  charQuotedColor: string;
}

interface CachedUserData {
  data: {
    country_name?: string;
    is_deleted?: boolean;
    is_banned?: boolean;
  };
  gotten_at: number;
}

interface UserStore {
  userUUID: string | null;
  username: string | null;
  personaName: string | null;
  userIcon: string | null;
  is_login: boolean;
  is_deleted: boolean | undefined;
  is_banned: boolean | undefined;
  is_admin: boolean;
  subscription_plan: string[] | null;
  imageURL: string | null;
  preferredModel: string;
  inferenceSettings: InferenceSettings;
  modelIdentifiers: ModelIdentifier[];
  maxTokenLimit: number;
  customization: Customization;
  show_nsfw: boolean;
  blocked_tags: string[];
  purchase_id: string | null;
  cachedUserData?: CachedUserData;
  token: string | null;
  strip_incomplete_output: boolean;
  setUserUUID: (uuid: string) => void;
  setUsername: (name: string) => void;
  setPersonaName: (name: string) => void;
  setUserIcon: (icon: string) => void;
  setIsLogin: (isLogin: boolean) => void;
  setIsDeleted: (isDeleted: boolean | undefined) => void;
  setIsBanned: (isBanned: boolean | undefined) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setSubscriptionPlan: (plan: string[]) => void;
  setImageURL: (url: string | null) => void;
  setPreferredModel: (model: string) => void;
  setInferenceSettings: (settings: InferenceSettings) => void;
  setModelIdentifiers: (models: ModelIdentifier[]) => void;
  setMaxTokenLimit: (limit: number) => void;
  setCustomization: (customization: Partial<Customization>) => void;
  toggleShowNSFW: () => void;
  setBlockedTags: (tags: string[]) => void;
  setPurchaseId: (purchaseId: string) => void;
  setCachedUserData: (cache: CachedUserData | undefined) => void;
  clearCachedUserData: () => void;
  clearData: () => void;
  setToken: (token: string | null) => void;
  setStripIncompleteOutput: (value: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userUUID: null,
      username: null,
      personaName: null,
      userIcon: null,
      is_login: false,
      is_deleted: undefined,
      is_banned: undefined,
      is_admin: false,
      subscription_plan: null,
      imageURL: null,
      preferredModel: '',
      inferenceSettings: {
        maxTokens: 100,
        temperature: 1,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0,
      },
      modelIdentifiers: [],
      maxTokenLimit: 200,
      customization: {
        user_color: '#555555',
        char_color: 'rgba(20,24,28,0.6)',
        userTextColor: '#FFFFFF',
        charTextColor: '#FFFFFF',
        userItalicColor: '#999999',
        charItalicColor: '#999999',
        userQuotedColor: '#AAAAAA',
        charQuotedColor: '#93BEE6',
      },
      show_nsfw: false,
      blocked_tags: [],
      purchase_id: null,
      cachedUserData: undefined,
      token: null,
      strip_incomplete_output: true,
      setUserUUID: (uuid) => set({ userUUID: uuid }),
      setUsername: (name) => set({ username: name }),
      setPersonaName: (name) => set({ personaName: name }),
      setUserIcon: (icon) => set({ userIcon: icon }),
      setIsLogin: (isLogin) => set({ is_login: isLogin }),
      setIsDeleted: (isDeleted) => set({ is_deleted: isDeleted }),
      setIsBanned: (isBanned) => set({ is_banned: isBanned }),
      setIsAdmin: (isAdmin) => set({ is_admin: isAdmin }),
      setSubscriptionPlan: (plan) => set({ subscription_plan: plan }),
      setImageURL: (url) => set({ imageURL: url }),
      setPreferredModel: (model) => set({ preferredModel: model }),
      setInferenceSettings: (settings) => set({ inferenceSettings: settings }),
      setModelIdentifiers: (models) => set({ modelIdentifiers: models }),
      setMaxTokenLimit: (limit) => set({ maxTokenLimit: limit }),
      setCustomization: (customization) =>
        set((state) => ({
          customization: { ...state.customization, ...customization },
        })),
      toggleShowNSFW: () => set((state) => ({ show_nsfw: !state.show_nsfw })),
      setBlockedTags: (tags) => set({ blocked_tags: tags }),
      setPurchaseId: (purchaseId) => set({ purchase_id: purchaseId }),
      setCachedUserData: (cache) => set({ cachedUserData: cache }),
      clearCachedUserData: () => set({ cachedUserData: undefined }),
      clearData: () =>
        set({
          userUUID: null,
          username: null,
          personaName: null,
          userIcon: null,
          is_login: false,
          is_deleted: undefined,
          is_banned: undefined,
          is_admin: false,
          subscription_plan: null,
          imageURL: null,
          preferredModel: '',
          inferenceSettings: {
            maxTokens: 100,
            temperature: 1,
            topP: 1,
            presencePenalty: 0,
            frequencyPenalty: 0,
          },
          modelIdentifiers: [],
          maxTokenLimit: 200,
          customization: {
            user_color: '#555555',
            char_color: 'rgba(20,24,28,0.6)',
            userTextColor: '#FFFFFF',
            charTextColor: '#FFFFFF',
            userItalicColor: '#999999',
            charItalicColor: '#999999',
            userQuotedColor: '#AAAAAA',
            charQuotedColor: '#93BEE6',
          },
          show_nsfw: false,
          blocked_tags: [],
          purchase_id: null,
          cachedUserData: undefined,
          token: null,
          strip_incomplete_output: true,
        }),
      setToken: (token) => set({ token }),
      setStripIncompleteOutput: (value) => set({ strip_incomplete_output: value }),
    }),
    {
      name: 'user-storage',
    }
  )
);
