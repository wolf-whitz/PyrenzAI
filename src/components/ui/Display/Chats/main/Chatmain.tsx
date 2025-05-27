import React, { useRef, useState } from 'react';
import { ChatContainerProps, Message } from '@shared-types/chatTypes';
import {
  SettingsSidebar,
  AdModal,
  ChatMessages,
  ChatInput,
  ChatHeader,
} from '@components';
import { useChatPageAPI } from '@api';
import { Fade, Slide, Box } from '@mui/material';

interface ChatMainProps extends ChatContainerProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messageIdRef: React.MutableRefObject<{
    charId: string | null;
    userId: string | null;
  }>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  chat_uuid: string;
  isGenerating: boolean;
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
}: ChatMainProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    messageId: string;
  } | null>(null);

  const {
    bgImage,
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
      <Box
        className={`flex flex-col h-screen w-full text-white relative ${
          bgImage ? 'bg-cover bg-center' : ''
        }`}
        style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}
      >
        <Box className="w-full max-w-6xl mx-auto pt-4">
          <ChatHeader
            char={{
              character_name: char?.character_name || 'Anon',
              icon: char?.icon || '',
            }}
            handleGoHome={handleGoHome}
            toggleSettings={toggleSettings}
          />
        </Box>

        <Box className="flex-1 w-full max-w-6xl mx-auto overflow-y-auto pb-16 lg:pb-20 xl:pb-20 pl-0 lg:pl-12">
          <ChatMessages
            previous_message={previous_message.map((msg) => ({
              ...msg,
              character_name: msg.character_name || 'Anon',
            }))}
            user={{ username: user?.username || 'Anon' }}
            char={{
              character_name: char?.character_name || 'Anon',
              gender: char?.gender,
            }}
            isGenerating={isGenerating}
            onRemove={handleRemoveMessage}
            onRegenerate={handleRegenerateMessage}
            onEditMessage={handleEditMessage}
            setIsGenerating={setIsGenerating}
          />
          <div ref={messagesEndRef}></div>
        </Box>

        <Slide direction="up" in={true} timeout={500}>
          <Box className="w-full  relative sm:relative">
            <ChatInput
              user={{
                username: user?.username || 'Anon',
                icon: user?.icon || '',
              }}
              char={{ character_name: char?.character_name || 'Anon' }}
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
