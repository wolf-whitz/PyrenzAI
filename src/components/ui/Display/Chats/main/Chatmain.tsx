import React from 'react';
import {
  AdModal,
  ChatMessages,
  ChatInput,
  ChatHeader,
  useChatPageAPI,
} from '@components';
import { Fade, Slide, Box } from '@mui/material';
import { useChatStore } from '~/store';

interface ChatMainProps {
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  chat_uuid: string;
  isGenerating: boolean;
}

export function ChatMain({
  isGenerating = false,
  setIsGenerating,
  chat_uuid,
}: ChatMainProps) {
  const { messages, firstMessage, user, char } = useChatStore();

  const {
    isAdModalOpen,
    setIsAdModalOpen,
    handleSend,
    handleRemoveMessage,
    handleRegenerateMessage,
    handleEditMessage,
    onGenerateImage,
  } = useChatPageAPI(messages, user, char, chat_uuid, setIsGenerating);

  return (
    <Fade in={true} timeout={500}>
      <Box className="flex flex-col h-screen w-full text-white relative">
        <Box className="w-full max-w-6xl mx-auto pt-4">
          <ChatHeader />
        </Box>
        <Box className="flex-1 w-full max-w-6xl mx-auto overflow-y-auto pb-16 lg:pb-20 xl:pb-20 pl-0 lg:pl-12">
          <ChatMessages
            firstMessage={firstMessage}
            previous_message={messages}
            isGenerating={isGenerating}
            onRemove={handleRemoveMessage}
            onRegenerate={handleRegenerateMessage}
            onEditMessage={handleEditMessage}
            setIsGenerating={setIsGenerating}
            onGenerateImage={onGenerateImage}
          />
        </Box>
        <Slide direction="up" in={true} timeout={500}>
          <Box className="w-full relative sm:relative">
            <ChatInput handleSend={handleSend} isGenerating={isGenerating} />
          </Box>
        </Slide>
        <AdModal isOpen={isAdModalOpen} onClose={() => setIsAdModalOpen(false)} />
      </Box>
    </Fade>
  );
}
