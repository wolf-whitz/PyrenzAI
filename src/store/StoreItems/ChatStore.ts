import { create } from 'zustand';

interface Message {
  character_name?: string;
  username?: string;
  text: string;
  icon: string;
  type: 'assistant' | 'user';
}

export interface UserData {
  user_uuid: string;
  username: string;
  icon: string;
}

interface Character {
  character_name: string;
  icon: string;
  first_message: string;
  profile_image?: string;
}

interface ChatStore {
  firstMessage: string;
  setFirstMessage: (message: string) => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  userData: UserData | null;
  setUserData: (userData: UserData) => void;
  character: Character | null;
  setCharacter: (character: Character) => void;
  clearData: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  firstMessage: '',
  setFirstMessage: (message: string) => set({ firstMessage: message }),

  messages: [],
  setMessages: (updater) =>
    set((state) => ({
      messages:
        typeof updater === 'function' ? updater(state.messages) : updater,
    })),

  userData: null,
  setUserData: (userData: UserData) => set({ userData }),

  character: null,
  setCharacter: (character: Character) => set({ character }),

  clearData: () =>
    set({ firstMessage: '', messages: [], userData: null, character: null }),
}));
