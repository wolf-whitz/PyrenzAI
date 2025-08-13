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
  error: string | null;
}

interface CharacterActions {
  setCharacter: (data: Partial<CharacterPayload>) => void;
  setGender: (gender: string) => void;
  setTokenTotal: (tokenTotal: number) => void;
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
    name: 'Anon',
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
    error: null,

    setCharacter: (data) => set((state) => ({ ...state, ...data })),
    setGender: (gender) => set({ gender }),
    setTokenTotal: (tokenTotal) => set({ tokenTotal }),
    addEmotion: (emotion) =>
      set((state) => ({ emotions: [...(state.emotions ?? []), emotion] })),
    setError: (error) => set({ error }),
    setFirstMessageAlternatives: (alternatives) => set({ first_message: alternatives }),
    setMaxAlternatives: (max) => set({ max_alternatives: max }),
    loadDraft: (draft) => set(() => ({ ...draft })),
  })
);
