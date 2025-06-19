import React, { useRef } from 'react';
import { ChatContainerProps, Character, User } from '@shared-types';
import {
  SettingsSidebar,
  AdModal,
  ChatMessages,
  ChatInput,
  ChatHeader,
} from '@components';
import { useChatPageAPI } from '@api';
import { Fade, Slide, Box } from '@mui/material';
import { useChatStore } from '~/store'; 

interface ChatMainProps extends Omit<ChatContainerProps, 'messageIdRef'> {
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  chat_uuid: string;
  isGenerating: boolean;
  char: Character;
  user: User;
}

export function ChatMain({
  user,
  char,
  isGenerating = false,
  setIsGenerating,
  chat_uuid,
}: ChatMainProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, firstMessage } = useChatStore();

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
    messages,
    user,
    char,
    chat_uuid,
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
            previous_message={messages.map((msg) => msg)}
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
