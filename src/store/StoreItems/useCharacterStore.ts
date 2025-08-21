import { create } from 'zustand';
import type { CharacterPayload } from '@shared-types';

interface EmotionData {
  triggerWords: string[];
  imageUrl: string | null;
  file: File | null;
}

interface StoreState {
  max_alternatives: number;
  tokenTotal: number;
  permanentTokens: number;
  temporaryTokens: number;
  error: string | null;
  isCounting: boolean;
}

interface CharacterActions {
  setCharacter: (
    data: Partial<CharacterPayload> | ((prev: CharacterPayload) => CharacterPayload)
  ) => void;
  setGender: (gender: string) => void;
  setTokenTotal: (tokenTotal: number) => void;
  setPermanentTokens: (tokens: number) => void;
  setTemporaryTokens: (tokens: number) => void;
  setIsCounting: (isCounting: boolean) => void;
  addEmotion: (emotion: EmotionData) => void;
  setError: (error: string | null) => void;
  setFirstMessageAlternatives: (alternatives: string[]) => void;
  setMaxAlternatives: (max: number) => void;
  loadDraft: (draft: CharacterPayload) => void;
}

export const useCharacterStore = create<CharacterPayload & StoreState & CharacterActions>()(
  (set) => ({
    char_uuid: '',
    title: '',
    name: '',
    description: '',
    persona: '',
    model_instructions: '',
    scenario: '',
    gender: '',
    first_message: [],
    creator: '',
    creator_uuid: '',
    tags: [],
    profile_image: '',
    is_public: false,
    is_nsfw: false,
    is_owner: false,
    is_details_private: false,
    is_banned: false,
    lorebook: '',
    attribute: '',
    emotions: [],
    profileImageFile: null,
    emotionImageFile: null,
    max_alternatives: 5,
    tokenTotal: 0,
    permanentTokens: 0,
    temporaryTokens: 0,
    error: null,
    isCounting: false,
    setCharacter: (data) =>
      set((state) => ({
        ...state,
        ...(typeof data === 'function' ? data(state) : data),
      })),
    setGender: (gender) => set({ gender }),
    setTokenTotal: (tokenTotal) => set({ tokenTotal }),
    setPermanentTokens: (tokens) => set({ permanentTokens: tokens }),
    setTemporaryTokens: (tokens) => set({ temporaryTokens: tokens }),
    setIsCounting: (isCounting) => set({ isCounting }),
    addEmotion: (emotion) =>
      set((state) => ({ emotions: [...(state.emotions ?? []), emotion] })),
    setError: (error) => set({ error }),
    setFirstMessageAlternatives: (alternatives) => set({ first_message: alternatives }),
    setMaxAlternatives: (max) => set({ max_alternatives: max }),
    loadDraft: (draft) => set(() => ({ ...draft })),
  })
);
