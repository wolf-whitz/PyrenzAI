import { create } from 'zustand';

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
  hideDetails: boolean;
  tags: string;
  gender: string;
  creator: string | null;
  profile_image: string | undefined;
}

interface CharacterActions {
  setCharacter: (data: Partial<CharacterState>) => void;
  setGender: (gender: string) => void;
}

export const useCharacterStore = create<CharacterState & CharacterActions>()(
  (set) => ({
    char_uuid: '',
    persona: '',
    is_public: false,
    is_nsfw: false,
    hideDetails: false,
    name: '',
    model_instructions: '',
    scenario: '',
    description: '',
    first_message: '',
    lorebook: '',
    tags: '[]',
    gender: '',
    creator: null,
    profile_image: undefined,

    setCharacter: (data) =>
      set((state) => ({
        ...state,
        ...data,
      })),

    setGender: (gender) => set(() => ({ gender })),
  })
);
