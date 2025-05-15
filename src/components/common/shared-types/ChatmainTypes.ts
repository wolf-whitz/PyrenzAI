export interface Message {
  id?: string;
  character_name: string;
  username?: string;
  text: string;
  icon: string;
  type: 'user' | 'assistant';
  token?: number | null;
  role?: string | null;
  error?: boolean;
  gender?: string;
}

export interface ChatMessagesProps {
  previous_message: Message[];
  isGenerating?: boolean;
  messageId?: string | null;
  token?: number | null;
  role?: string | null;
  user: { username: string };
  char: { character_name: string; gender?: string };
  onRegenerate?: (messageId: string) => void;
  onRemove?: (messageId: string) => void;
}
