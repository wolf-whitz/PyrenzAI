import { create } from 'zustand';
import { Message, User as UserData, Character } from '@components';

interface ChatStore {
  firstMessage: string;
  setFirstMessage: (message: string) => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  user: UserData | null;
  setUser: (user: UserData) => void;
  char: Character | null;
  setChar: (char: Character) => void;
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

  user: null,
  setUser: (user: UserData) => set({ user }),

  char: null,
  setChar: (char: Character) => set({ char }),
}));
