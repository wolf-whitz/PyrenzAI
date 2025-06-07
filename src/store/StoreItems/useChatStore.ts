import { create } from 'zustand';
import { Message, User as UserData, Character } from '@components';

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
