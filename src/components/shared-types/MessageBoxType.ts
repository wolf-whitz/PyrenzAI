import type { Message, User, Character } from '@shared-types';

export interface MessageBoxProps {
  msg: Message;
  index: number;
  isGenerating: boolean;
  isLastMessage: boolean;
  user: User;
  char: Character;
  onRegenerate: (messageId: number) => void;
  onRemove: (messageId: number) => void;
  onEditMessage: (
    messageId: number,
    editedMessage: string,
    type: 'user' | 'char'
  ) => void;
  handleSpeak: (text: string) => void;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  editingMessageId: number | null;
  editingMessageType: 'user' | 'char' | null;
  editedMessage: string;
  isLoading: boolean;
  onEditClick: (
    messageId: number,
    currentMessage: string,
    type: 'user' | 'char'
  ) => void;
  onSaveEdit: (
    messageId: number,
    editedMessage: string,
    type: 'user' | 'char'
  ) => void;
  onCancelEdit: () => void;
  setEditedMessage: (message: string) => void;
  onGenerateImage: (messageId: number) => void;
}
