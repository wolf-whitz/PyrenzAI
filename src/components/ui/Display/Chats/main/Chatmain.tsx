import React, { useRef, useState, useEffect } from 'react';
import { ChatContainerProps, Message, Character } from '@shared-types';
import {
  SettingsSidebar,
  AdModal,
  ChatMessages,
  ChatInput,
  ChatHeader,
} from '@components';
import { useChatPageAPI } from '@api';
import { Fade, Slide, Box } from '@mui/material';

interface MessageIdRef {
  charId: string | null;
  userId: string | null;
}

interface ChatMainProps extends Omit<ChatContainerProps, 'messageIdRef'> {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messageIdRef: React.MutableRefObject<MessageIdRef>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  chat_uuid: string;
  isGenerating: boolean;
  char: Character;
  firstMessage?: string;
}

export function ChatMain({
  user,
  char,
  previous_message = [],
  isGenerating = false,
  setMessages,
  messageIdRef,
  setIsGenerating,
  chat_uuid,
  firstMessage,
}: ChatMainProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isSettingsOpen,
    isAdModalOpen,
    setIsAdModalOpen,
    toggleSettings,
    handleSend,
    handleGoHome,
    handleRemoveMessage,
    handleRegenerateMessage,
    handleEditMessage,
  } = useChatPageAPI(
    messagesEndRef,
    previous_message,
    setMessages,
    user,
    char,
    chat_uuid,
    messageIdRef,
    setIsGenerating
  );

  return (
    <Fade in={true} timeout={500}>
      <Box className="flex flex-col h-screen w-full text-white relative">
        <Box className="w-full max-w-6xl mx-auto pt-4">
          <ChatHeader
            char={char}
            handleGoHome={handleGoHome}
            toggleSettings={toggleSettings}
          />
        </Box>

        <Box className="flex-1 w-full max-w-6xl mx-auto overflow-y-auto pb-16 lg:pb-20 xl:pb-20 pl-0 lg:pl-12">
          <ChatMessages
            firstMessage={firstMessage}
            previous_message={previous_message.map((msg) => msg)}
            user={user}
            char={char}
            isGenerating={isGenerating}
            onRemove={handleRemoveMessage}
            onRegenerate={handleRegenerateMessage}
            onEditMessage={handleEditMessage}
            setIsGenerating={setIsGenerating}
          />
          <div ref={messagesEndRef}></div>
        </Box>

        <Slide direction="up" in={true} timeout={500}>
          <Box className="w-full relative sm:relative">
            <ChatInput
              user={user}
              char={char}
              handleSend={handleSend}
              isGenerating={isGenerating}
            />
          </Box>
        </Slide>

        <SettingsSidebar
          settingsOpen={isSettingsOpen}
          onClose={toggleSettings}
        />

        <AdModal
          isOpen={isAdModalOpen}
          onClose={() => setIsAdModalOpen(false)}
        />
      </Box>
    </Fade>
  );
}
