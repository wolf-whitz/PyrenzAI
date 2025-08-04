import { create } from 'zustand';

interface EmotionData {
  triggerWords: string[];
  imageUrl: string | null;
  file: File | null;
}

interface CharacterState {
  char_uuid: string;
  persona: string;
  name: string;
  model_instructions: string;
  scenario: string;
  description: string;
  first_message: string;
  lorebook: string;
  is_public: boolean;
  is_nsfw: boolean;
  is_details_private: boolean;
  tags: string[];
  gender: string;
  creator: string | null;
  profile_image: string | undefined;
  emotions: EmotionData[];
}

interface CharacterActions {
  tokenTotal: number;
  error: string | null;
  setCharacter: (data: Partial<CharacterState>) => void;
  setGender: (gender: string) => void;
  setTokenTotal: (tokenTotal: number) => void;
  addEmotion: (emotion: EmotionData) => void;
  setError: (error: string | null) => void;
}

export const useCharacterStore = create<CharacterState & CharacterActions>()(
  (set) => ({
    char_uuid: '',
    persona: '',
    is_public: false,
    is_nsfw: false,
    is_details_private: false,
    name: '',
    model_instructions: '',
    scenario: '',
    description: '',
    first_message: '',
    lorebook: '',
    tags: [],
    gender: '',
    creator: null,
    profile_image: undefined,
    emotions: [],
    tokenTotal: 0,
    error: null,
    setCharacter: (data) =>
      set((state) => ({
        ...state,
        ...data,
      })),
    setGender: (gender) => set(() => ({ gender })),
    setTokenTotal: (tokenTotal) => set(() => ({ tokenTotal })),
    addEmotion: (emotion) =>
      set((state) => ({
        emotions: [...state.emotions, emotion],
      })),
    setError: (error) => set(() => ({ error })),
  })
);
