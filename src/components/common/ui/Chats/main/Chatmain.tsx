import React, { useEffect, useState, useRef } from 'react';
import { ChatContainerProps } from '@shared-types/chatTypes';
import ChatInput from '../ChatInput';
import ChatMessages from '../ChatMessages';
import { motion } from 'framer-motion';
import { Avatar, Typography, IconButton } from '@mui/material';
import { Settings } from 'lucide-react';
import { SettingsSidebar } from '@components/index';

export default function ChatMain({
  user,
  char,
  previous_message = [],
  isGenerating,
  messagesEndRef,
  handleSend,
}: ChatContainerProps) {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const storedBgImage = localStorage.getItem('bgImage');
    if (storedBgImage) {
      handleBackgroundChange(storedBgImage);
    }
  }, []);

  useEffect(() => {
    const scrollWithDelay = () => {
      if (messagesEndRef?.current) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    };

    scrollWithDelay();
  }, [previous_message, messagesEndRef]);

  useEffect(() => {
    if (bgImage) {
      localStorage.setItem('bgImage', bgImage);
    } else {
      localStorage.removeItem('bgImage');
    }
  }, [bgImage]);

  const handleBackgroundChange = (newImageUrl: string | null) => {
    setBgImage(newImageUrl);
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

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
          alt={char?.name || 'Anon'}
          src={
            char?.icon ||
            `https://api.dicebear.com/9.x/adventurer/svg?seed=${char?.name?.split('@')[0] || 'Anon'}`
          }
          className="w-16 h-16"
        />
        <div className="flex items-center mt-2">
          <Typography variant="h6" className="text-lg font-bold">
            {char?.name || 'Anon'}
          </Typography>
          <IconButton onClick={toggleSettings} className="ml-2 text-white">
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
          previous_message={previous_message}
          role="assistant"
          isGenerating={isGenerating}
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
          onSend={handleSend}
          user={{
            name: user?.name || 'Anon',
            icon:
              user?.icon ||
              `https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.name?.split('@')[0] || 'Anon'}`,
          }}
          char={{ name: char?.name || 'Anon' }}
        />
      </motion.div>

      <SettingsSidebar settingsOpen={isSettingsOpen} onClose={toggleSettings} />
    </motion.div>
  );
}
