import type { Message, User, Character } from '@shared-types';

export interface MessageBoxProps {
  msg: Message;
  index: number;
  isGenerating: boolean;
  isLastMessage: boolean;
  user: User;
  char: Character;
  onRegenerate: (messageId: string) => void;
  onRemove: (messageId: string) => void;
  onEditMessage: (
    messageId: string,
    editedMessage: string,
    type: 'user' | 'char'
  ) => void;
  handleSpeak: (text: string) => void;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  editingMessageId: string | null;
  editingMessageType: 'user' | 'char' | null;
  editedMessage: string;
  isLoading: boolean;
  onEditClick: (
    messageId: string,
    currentMessage: string,
    type: 'user' | 'char'
  ) => void;
  onSaveEdit: (
    messageId: string,
    editedMessage: string,
    type: 'user' | 'char'
  ) => void;
  onCancelEdit: () => void;
  setEditedMessage: (message: string) => void;
}
