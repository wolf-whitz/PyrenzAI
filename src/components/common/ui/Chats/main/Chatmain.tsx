import React, { useRef, useState } from 'react';
import { ChatContainerProps, Message } from '@shared-types/chatTypes';
import ChatInput from '../ChatInput';
import ChatMessages from '../ChatMessages';
import { motion } from 'framer-motion';
import { Avatar, Typography, IconButton } from '@mui/material';
import { Settings, ChevronLeft } from 'lucide-react';
import { SettingsSidebar, AdModal } from '@components/index';
import { useChatPageAPI } from '~/api';

interface ChatMainProps extends ChatContainerProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messageIdRef: React.MutableRefObject<{
    charId: string | null;
    userId: string | null;
  }>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  conversation_id: string;
  isGenerating: boolean;
}

export default function ChatMain({
  user,
  char,
  previous_message = [],
  isGenerating = false,
  setMessages,
  messageIdRef,
  setIsGenerating,
  conversation_id,
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
  } = useChatPageAPI(
    messagesEndRef,
    previous_message,
    setMessages,
    user,
    char,
    conversation_id,
    messageIdRef,
    setIsGenerating
  );

  return (
    <motion.div
      className="flex flex-col h-screen text-white p-4 relative w-full justify-center items-center"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: bgImage ? 'cover' : 'auto',
        backgroundPosition: bgImage ? 'center' : 'unset',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full flex flex-col items-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Avatar
          alt={char?.character_name || 'Anon'}
          src={char?.icon || ''}
          className="w-16 h-16"
        />
        <div className="flex items-center mt-2">
          <IconButton
            onClick={handleGoHome}
            className="mr-2 text-white"
            aria-label="Go home"
          >
            <ChevronLeft className="w-6 h-6" />
          </IconButton>
          <Typography variant="h6" className="text-lg font-bold">
            {char?.character_name || 'Anon'}
          </Typography>
          <IconButton
            onClick={toggleSettings}
            className="ml-2 text-white"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6" />
          </IconButton>
        </div>
      </motion.div>

      <motion.div
        className="flex-1 w-full overflow-y-auto pb-[60px] lg:pb-[80px] xl:pb-[80px] lg:pl-[50px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
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
          setIsGenerating={setIsGenerating}
        />
        <div ref={messagesEndRef}></div>
      </motion.div>

      <motion.div
        className="w-full bg-charcoal sm:relative sm:bg-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ChatInput
          user={{
            username: user?.username || 'Anon',
            icon: user?.icon || '',
          }}
          char={{ character_name: char?.character_name || 'Anon' }}
          handleSend={handleSend}
          isGenerating={isGenerating}
        />
      </motion.div>

      <SettingsSidebar settingsOpen={isSettingsOpen} onClose={toggleSettings} />

      <AdModal isOpen={isAdModalOpen} onClose={() => setIsAdModalOpen(false)} />
    </motion.div>
  );
}
