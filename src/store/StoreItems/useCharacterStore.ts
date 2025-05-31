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
  textarea_token: Record<string, number>;
  token_total: number;
  profile_image?: string;
}

interface CharacterActions {
  setCharacterData: (data: Partial<CharacterState>) => void;
  setGender: (gender: string) => void;
}

export const useCharacterStore = create<CharacterState & CharacterActions>(
  (set) => ({
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

    setCharacterData: (data: Partial<CharacterState>) =>
      set((state) => {
        const newTextareaToken: Record<string, number> = {
          ...state.textarea_token,
          ...data.textarea_token,
        };

        const newTokenTotal: number = Object.values(newTextareaToken).reduce(
          (acc, val) => acc + val,
          0
        );

        const tags = data.tags as string | string[] | undefined;

        let processedTags: string[] = state.tags;

        if (Array.isArray(tags)) {
          processedTags = tags
            .map((tag: string) => tag.trim().toLowerCase())
            .filter((tag: string) => tag.length > 0);
        } else if (typeof tags === 'string' && tags !== '') {
          processedTags = tags
            .split(',')
            .map((tag: string) => tag.trim().toLowerCase())
            .filter((tag: string) => tag.length > 0);
        } else if (typeof tags === 'string' && tags === '') {
          processedTags = [];
        } else if (tags === undefined) {
          processedTags = state.tags;
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
  })
);
