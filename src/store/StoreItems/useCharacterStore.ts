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
}

interface CharacterActions {
  setCharacter: (
    data:
      | Partial<CharacterPayload & StoreState>
      | ((prev: CharacterPayload & StoreState) => CharacterPayload & StoreState)
  ) => void;
  setGender: (gender: string) => void;
  setTokenTotal: (tokenTotal: number) => void;
  setPermanentTokens: (tokens: number) => void;
  setTemporaryTokens: (tokens: number) => void;
  addEmotion: (emotion: EmotionData) => void;
  setError: (error: string | null) => void;
  setFirstMessageAlternatives: (alternatives: string[]) => void;
  setMaxAlternatives: (max: number) => void;
  loadDraft: (draft: CharacterPayload) => void;
}

export const useCharacterStore = create<
  CharacterPayload & StoreState & CharacterActions
>()((set) => ({
  char_uuid: '',
  title: '',
  name: '',
  description: '',
  persona: '',
  model_instructions: '',
  scenario: '',
  gender: '',
  first_message: [],
  message_example: '',
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

  setCharacter: (data) =>
    set((state) => {
      const nextState =
        typeof data === 'function' ? data(state) : { ...state, ...data };

      if (nextState.first_message) {
        if (typeof nextState.first_message === 'string') {
          nextState.first_message = [nextState.first_message];
        } else if (!Array.isArray(nextState.first_message)) {
          nextState.first_message = [];
        }
      } else {
        nextState.first_message = [];
      }

      if (Array.isArray(nextState.message_example)) {
        nextState.message_example = nextState.message_example.join(' ');
      }

      return nextState;
    }),

  setGender: (gender) => set({ gender }),
  setTokenTotal: (tokenTotal) => set({ tokenTotal }),
  setPermanentTokens: (tokens) => set({ permanentTokens: tokens }),
  setTemporaryTokens: (tokens) => set({ temporaryTokens: tokens }),
  addEmotion: (emotion) =>
    set((state) => ({ emotions: [...(state.emotions ?? []), emotion] })),
  setError: (error) => set({ error }),
  setFirstMessageAlternatives: (alternatives) =>
    set({ first_message: alternatives }),
  setMaxAlternatives: (max) => set({ max_alternatives: max }),
  loadDraft: (draft) =>
    set(() => {
      let fm: string[] = [];
      if (draft.first_message) {
        fm =
          typeof draft.first_message === 'string'
            ? [draft.first_message]
            : draft.first_message;
      }
      let me = draft.message_example;
      if (Array.isArray(me)) me = me.join(' ');
      return { ...draft, first_message: fm, message_example: me };
    }),
}));
