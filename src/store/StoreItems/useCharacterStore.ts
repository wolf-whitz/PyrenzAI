import { create } from 'zustand';

interface CharacterState {
  char_uuid: string;
  persona: string;
  name: string;
  model_instructions: string;
  scenario: string;
  description: string;
  first_message: string;
  is_public: boolean;
  is_nsfw: boolean;
  tags: string[];
  gender: string;
  creator: string | null;
  textarea_token: { [key: string]: number };
  token_total: number;
  profile_image?: string;
}

interface CharacterActions {
  setCharacterData: (data: Partial<CharacterState>) => void;
  setGender: (gender: string) => void;
}

export const useCharacterStore = create<CharacterState & CharacterActions>((set) => ({
  char_uuid: '',
  persona: '',
  is_public: false,
  is_nsfw: false,
  name: '',
  model_instructions: '',
  scenario: '',
  description: '',
  first_message: '',
  tags: [],
  gender: '',
  creator: null,
  textarea_token: {},
  token_total: 0,
  profile_image: undefined,

  setCharacterData: (data) =>
    set((state) => {
      const newTextareaToken = {
        ...state.textarea_token,
        ...data.textarea_token,
      };
      const newTokenTotal = Object.values(newTextareaToken).reduce((a, b) => a + b, 0);

      let processedTags = state.tags;
      const tags = data.tags as string | string[] | undefined;

      if (Array.isArray(tags)) {
        processedTags = tags;
      } else if (typeof tags === 'string') {
        processedTags = tags.trim() === '' ? [] : [tags];
      }

      return {
        ...state,
        ...data,
        tags: processedTags,
        textarea_token: newTextareaToken,
        token_total: newTokenTotal,
      };
    }),

  setGender: (gender: string) => set(() => ({ gender })),
}));
