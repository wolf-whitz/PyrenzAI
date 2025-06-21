import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MoreVertical, Loader2 } from 'lucide-react';
import { Menu } from '@components';
import { Character } from '@shared-types';
import { Box } from '@mui/material';

interface ChatInputProps {
  className?: string;
  handleSend: (message: string) => void;
  user: { username: string; user_avatar: string };
  char: { name: string };
  isGenerating: boolean;
}

const MAX_CHAR_LIMIT = 1500;
const MAX_TEXT_AREA_HEIGHT = 200;

export function ChatInput({
  className,
  handleSend,
  char,
  isGenerating,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    handleSend(trimmedMessage);
    setMessage('');
  }, [message, handleSend]);

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, MAX_TEXT_AREA_HEIGHT)}px`;
    }
  }, [message]);

  return (
    <>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative mx-auto w-full max-w-full md:max-w-[500px] lg:max-w-[640px] p-4 ${className}`}
      >
        <Box
          className={`relative flex bg-gray-700 rounded-lg p-3 w-full ${className}`}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <button
              className="mr-2 text-gray-400 hover:text-white transition duration-200 p-2 rounded-full flex-shrink-0"
              onClick={() => setIsMenuOpen(true)}
              aria-label="More options"
            >
              <MoreVertical size={20} />
            </button>
          </motion.div>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Chat with ${char.name}`}
            className="flex-1 w-full bg-transparent outline-none text-white px-4 py-2 rounded-lg focus:ring-0 resize-none overflow-auto min-w-0"
            rows={1}
            maxLength={MAX_CHAR_LIMIT}
            disabled={isGenerating}
            style={{ maxHeight: `${MAX_TEXT_AREA_HEIGHT}px` }}
          />
          <motion.div
            whileHover={!isGenerating && message.trim() ? { scale: 1.05 } : {}}
            whileTap={!isGenerating && message.trim() ? { scale: 0.95 } : {}}
          >
            <button
              onClick={sendMessage}
              className={`ml-2 flex items-center gap-1 text-gray-400 transition duration-200 p-2 rounded-full flex-shrink-0 ${
                !message.trim() || isGenerating
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:text-white'
              }`}
              aria-label="Send message"
              disabled={!message.trim() || isGenerating}
            >
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </Box>
      </Box>
      {isMenuOpen && (
        <Menu onClose={() => setIsMenuOpen(false)} char={char as Character} />
      )}
    </>
  );
}
