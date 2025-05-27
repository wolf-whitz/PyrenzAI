import { MutableRefObject, RefObject } from 'react';

export interface Message {
  character_name?: string;
  text: string;
  id?: string;
  icon: string;
  type: 'user' | 'assistant';
  username?: string;
  char_name?: string;
  isGenerate?: boolean;
  isFirst?: boolean;
  token?: number | null;
  role?: string;
  chat_uuid?: string;
  error?: boolean;
  gender?: string;
}

export interface User {
  username: string;
  icon: string;
}

export interface Character {
  character_name: string;
  persona?: string;
  scenario?: string;
  gender?: string;
  description: string;
  first_message: string;
  tags?: string[];
  profile_image?: string;
  token_total?: number;
  icon?: string;
}

export interface ChatContainerProps {
  user: User | null;
  char?: Partial<Character>;
  firstMessage?: string | null;
  previous_message?: Message[];
  isGenerating?: boolean;
  handleSend?: (text: string) => Promise<void>;
  messageIdRef?: MutableRefObject<{
    charId: string | null;
    userId: string | null;
  } | null>;
  messagesEndRef?: RefObject<HTMLDivElement>;
}

export interface ChatMessagesProps {
  previous_message: Message[];
  user: User;
  char: Character;
  isGenerating?: boolean;
  onRemove?: (messageId: string) => void;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface GenerateResponse {
  data: {
    role: string;
    content: string;
  };
  Engine: string;
  token: number;
  id: Array<{
    userMessageUuid: string;
    charMessageUuid: string;
  }>;
  remainingMessages: number;
}

export type Chat = {
  chat_uuid: string;
  char_uuid: string;
  preview_message: string;
  preview_image: string;
};
