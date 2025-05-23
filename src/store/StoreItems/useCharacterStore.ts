import { create } from 'zustand';

interface CharacterState {
  persona: string;
  name: string;
  model_instructions: string;
  scenario: string;
  description: string;
  first_message: string;
  is_public: boolean;
  is_nsfw: boolean;
  tags: string | string[];
  gender: string;
  creator: string | null;
  textarea_token: { [key: string]: number };
  token_total: number;
  profile_image?: string;
}

interface CharacterActions {
  setCharacterData: (data: Partial<CharacterState>) => void;
}

export const useCharacterStore = create<CharacterState & CharacterActions>((set) => ({
  persona: '',
  is_public: false,
  is_nsfw: false,
  name: '',
  model_instructions: '',
  scenario: '',
  description: '',
  first_message: '',
  tags: '',
  gender: '',
  creator: null,
  textarea_token: {}, 
  token_total: 0,
  profile_image: undefined,

  setCharacterData: (data: Partial<CharacterState>) =>
    set((state) => {
      const newTextareaToken = {
        ...state.textarea_token,
        ...data.textarea_token,
      };
      const newTokenTotal = Object.values(newTextareaToken).reduce(
        (a, b) => a + b,
        0
      );

      return {
        ...state,
        ...data,
        tags:
          typeof data.tags === 'string'
            ? data.tags
            : Array.isArray(data.tags)
              ? data.tags.join(', ')
              : state.tags,
        textarea_token: newTextareaToken,
        token_total: newTokenTotal,
      };
    }),
}));
