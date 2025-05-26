import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ChatMessagesProps } from '@shared-types/ChatmainTypes';
import { speakMessage } from '@api';
import { MessageBox } from '@components';

export function ChatMessages({
  previous_message,
  isGenerating = false,
  user,
  char,
  onRegenerate,
  onRemove,
  onEditMessage,
  setIsGenerating,
}: ChatMessagesProps & {
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  onEditMessage?: (messageId: string, editedMessage: string, type: 'user' | 'char') => void;
}) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSpeak = async (text: string) => {
    setIsGenerating(true);
    try {
      await speakMessage(text, char.gender as string, () => {
        setIsGenerating(false);
      });
    } catch (error) {
      console.error("Error speaking message:", error);
      setIsGenerating(false);
    }
  };

  const handleEditClick = (messageId: string, currentMessage: string) => {
    setEditingMessageId(messageId);
    setEditedMessage(currentMessage);
  };

  const handleSaveEdit = async (messageId: string, type: 'user' | 'char') => {
    if (onEditMessage) {
      setIsLoading(true);
      await onEditMessage(messageId, editedMessage, type);
      setIsLoading(false);
    }
    setEditingMessageId(null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
  };

  const defaultOnRegenerate = (messageId: string) => {};
  const defaultOnRemove = (messageId: string) => {};
  const defaultOnEditMessage = (messageId: string, editedMessage: string, type: 'user' | 'char') => {};

  return (
    <Box className="space-y-4 p-4 max-w-2xl mx-auto">
      {previous_message.map((msg, index) => {
        const isUser = msg.type === 'user';
        const displayName = isUser
          ? msg.username || user.username
          : msg.character_name || char.character_name;
        const icon = msg.icon || '';
        const isLastMessage = index === previous_message.length - 1;

        return (
          <MessageBox
            key={msg.id ? `${msg.id}-${index}` : `temp-${index}`}
            msg={msg}
            index={index}
            isUser={isUser}
            displayName={displayName}
            icon={icon}
            isGenerating={isGenerating}
            isLastMessage={isLastMessage}
            user={user}
            char={char}
            onRegenerate={onRegenerate || defaultOnRegenerate}
            onRemove={onRemove || defaultOnRemove}
            onEditMessage={onEditMessage || defaultOnEditMessage}
            handleSpeak={handleSpeak}
            setIsGenerating={setIsGenerating}
            editingMessageId={editingMessageId}
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
