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

interface UserStore {
  userUUID: string | null;
  userIcon: string | null;
  subscription_plan: string[] | null;
  imageURL: string | null;
  preferredModel: string;
  inferenceSettings: InferenceSettings;
  modelIdentifiers: ModelIdentifier[];
  maxTokenLimit: number;
  setUserUUID: (uuid: string) => void;
  setUserIcon: (icon: string) => void;
  setSubscriptionPlan: (plan: string[]) => void;
  setImageURL: (url: string | null) => void;
  setPreferredModel: (model: string) => void;
  setInferenceSettings: (settings: InferenceSettings) => void;
  setModelIdentifiers: (models: ModelIdentifier[]) => void;
  setMaxTokenLimit: (limit: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userUUID: null,
      userIcon: null,
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
      setUserUUID: (uuid) => set({ userUUID: uuid }),
      setUserIcon: (icon) => set({ userIcon: icon }),
      setSubscriptionPlan: (plan) => set({ subscription_plan: plan }),
      setImageURL: (url) => set({ imageURL: url }),
      setPreferredModel: (model) => set({ preferredModel: model }),
      setInferenceSettings: (settings) => set({ inferenceSettings: settings }),
      setModelIdentifiers: (models) => set({ modelIdentifiers: models }),
      setMaxTokenLimit: (limit) => set({ maxTokenLimit: limit }),
    }),
    {
      name: 'user-storage',
    }
  )
);
