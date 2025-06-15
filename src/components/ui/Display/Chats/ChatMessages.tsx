import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ChatMessagesProps, Message } from '@shared-types';
import { speakMessage } from '@api';
import { MessageBox, Character } from '@components';

interface ChatMessagesExtendedProps extends ChatMessagesProps {
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  onEditMessage?: (
    messageId: string,
    editedMessage: string,
    type: 'user' | 'char'
  ) => void;
  firstMessage?: string;
}

export function ChatMessages({
  previous_message,
  isGenerating = false,
  user,
  char,
  onRegenerate,
  onRemove,
  onEditMessage,
  setIsGenerating,
  firstMessage,
}: ChatMessagesExtendedProps) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageType, setEditingMessageType] = useState<'user' | 'char' | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSpeak = async (text: string) => {
    setIsGenerating(true);
    try {
      await speakMessage(text, char.gender as string, () => {
        setIsGenerating(false);
      });
    } catch {
      setIsGenerating(false);
    }
  };

  const handleEditClick = (
    messageId: string,
    currentMessage: string,
    type: 'user' | 'char'
  ) => {
    setEditingMessageId(messageId);
    setEditingMessageType(type);
    setEditedMessage(currentMessage);
  };

  const handleSaveEdit = async (messageId: string, editedMessage: string, type: 'user' | 'char') => {
    if (onEditMessage) {
      setIsLoading(true);
      await onEditMessage(messageId, editedMessage, type);
      setIsLoading(false);
    }
    setEditingMessageId(null);
    setEditingMessageType(null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingMessageType(null);
  };

  const defaultOnRegenerate = (messageId: string) => {};
  const defaultOnRemove = (messageId: string) => {};
  const defaultOnEditMessage = (
    messageId: string,
    editedMessage: string,
    type: 'user' | 'char'
  ) => {};

  const messages = firstMessage
    ? [
        {
          id: 'first-message',
          type: 'assistant',
          text: firstMessage,
          name: char.name,
          profile_image: char.profile_image,
        },
        ...previous_message,
      ]
    : previous_message;

  return (
    <Box className="space-y-4 p-4 max-w-2xl mx-auto">
      {messages.map((msg: Message, index: number) => {
        const isLastMessage = index === messages.length - 1;

        return (
          <MessageBox
            key={`${msg.type}-${msg.id ?? `temp-${index}`}`}
            msg={msg}
            index={index}
            isGenerating={isGenerating}
            isLastMessage={isLastMessage}
            user={user}
            char={char as Character}
            onRegenerate={onRegenerate || defaultOnRegenerate}
            onRemove={onRemove || defaultOnRemove}
            onEditMessage={onEditMessage || defaultOnEditMessage}
            handleSpeak={handleSpeak}
            setIsGenerating={setIsGenerating}
            editingMessageId={editingMessageId}
            editingMessageType={editingMessageType}
            editedMessage={editedMessage}
            isLoading={isLoading}
            onEditClick={handleEditClick}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            setEditedMessage={setEditedMessage}
          />
        );
      })}
    </Box>
  );
}
