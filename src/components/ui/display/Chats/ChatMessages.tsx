import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { ChatMessagesProps, Message } from '@shared-types';
import { MessageBox, speakMessage } from '@components';
import { useChatStore } from '~/store';

interface ChatMessagesExtendedProps
  extends Omit<ChatMessagesProps, 'user' | 'char'> {
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  onEditMessage: (
    messageId: number,
    editedMessage: string,
    type: 'user' | 'char'
  ) => void;
  firstMessage: string;
  onGenerateImage: (messageId: number) => void;
}

export function ChatMessages({
  previous_message,
  isGenerating = false,
  onRegenerate,
  onRemove,
  onEditMessage,
  setIsGenerating,
  firstMessage,
  onGenerateImage,
}: ChatMessagesExtendedProps) {
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingMessageType, setEditingMessageType] = useState<
    'user' | 'char' | null
  >(null);
  const [editedMessage, setEditedMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { user, char, alternativeFirstMessages } = useChatStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [previous_message, firstMessage]);

  const handleSpeak = async (text: string) => {
    setIsGenerating(true);
    try {
      await speakMessage(text, char?.gender as string, () =>
        setIsGenerating(false)
      );
    } catch {
      setIsGenerating(false);
    }
  };

  const handleEditClick = (
    messageId: number,
    currentMessage: string,
    type: 'user' | 'char'
  ) => {
    setEditingMessageId(messageId);
    setEditingMessageType(type);
    setEditedMessage(currentMessage);
  };

  const handleSaveEdit = async (
    messageId: number,
    editedMessage: string,
    type: 'user' | 'char'
  ) => {
    setIsLoading(true);
    await onEditMessage(messageId, editedMessage, type);
    setIsLoading(false);
    setEditingMessageId(null);
    setEditingMessageType(null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingMessageType(null);
  };

  const messages: Message[] = (() => {
    if (!previous_message) return [];

    const alreadyIncludesFirst = previous_message.some(
      (m) => m.text === firstMessage && m.type === 'char'
    );

    if (firstMessage && !alreadyIncludesFirst) {
      return [
        {
          id: 0,
          type: 'char',
          text: firstMessage,
          name: char?.name,
          profile_image: char?.profile_image,
          alternative_messages: alternativeFirstMessages,
          current: 0,
        },
        ...previous_message,
      ];
    }

    return previous_message;
  })();

  return (
    <Box className="space-y-4 p-4 max-w-2xl mx-auto">
      {messages.map((msg, index) => {
        const isLastMessage = index === messages.length - 1;

        return (
          <MessageBox
            key={`${msg.type}-${msg.id ?? `temp-${index}`}`}
            msg={msg}
            index={index}
            isGenerating={isGenerating}
            isLastMessage={isLastMessage}
            user={user}
            char={char}
            onRegenerate={onRegenerate}
            onRemove={onRemove}
            handleSpeak={handleSpeak}
            setIsGenerating={setIsGenerating}
            editingMessageId={editingMessageId}
            editingMessageType={editingMessageType}
            editedMessage={editedMessage}
            onEditClick={handleEditClick}
            onEditMessage={onEditMessage}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            setEditedMessage={setEditedMessage}
            isLoading={isLoading}
            onGenerateImage={onGenerateImage}
          />
        );
      })}
      <div ref={bottomRef} />
    </Box>
  );
}
