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
  userTextColor: string;
  charTextColor: string;
  userItalicColor: string;
  charItalicColor: string;
  userQuotedColor: string;
  charQuotedColor: string;
}

interface ApiResponse {
  username: string;
  user_avatar: string;
  user_uuid: string;
  ai_customization: any;
  preferred_model?: string;
  is_admin: boolean;
  subscription_data: {
    tier: string;
    max_token: number;
    model: { [key: string]: ModelIdentifier };
    private_models: { [key: string]: any };
  };
  persona_name?: string;
}

interface CachedUserData {
  data: ApiResponse;
  gotten_at: number;
}

interface UserStore {
  userUUID: string | null;
  username: string | null;
  personaName: string | null;
  userIcon: string | null;
  is_login: boolean;
  is_deleted: boolean | undefined;
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
  setUserUUID: (uuid: string) => void;
  setUsername: (name: string) => void;
  setPersonaName: (name: string) => void;
  setUserIcon: (icon: string) => void;
  setIsLogin: (isLogin: boolean) => void;
  setIsDeleted: (isDeleted: boolean | undefined) => void;
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
      setUserUUID: (uuid) => set({ userUUID: uuid }),
      setUsername: (name) => set({ username: name }),
      setPersonaName: (name) => set({ personaName: name }),
      setUserIcon: (icon) => set({ userIcon: icon }),
      setIsLogin: (isLogin) => set({ is_login: isLogin }),
      setIsDeleted: (isDeleted) => set({ is_deleted: isDeleted }),
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
    }),
    {
      name: 'user-storage',
    }
  )
);
