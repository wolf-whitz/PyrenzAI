import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight, MoreVertical, Loader2 } from 'lucide-react';
import { Menu } from '@components';
import { Character } from '@shared-types';
import { usePyrenzAlert } from '~/provider';

interface ChatInputProps {
  className?: string;
  handleSend: (message: string) => void;
  user: { username: string; user_avatar: string };
  char: { name: string };
  isGenerating: boolean;
}

const MAX_CHAR_LIMIT = 1500;

export function ChatInput({
  className,
  handleSend,
  char,
  isGenerating,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const showAlert = usePyrenzAlert();

  const sendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || trimmedMessage.length > MAX_CHAR_LIMIT) return;

    handleSend(trimmedMessage);
    setMessage('');
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    if (newMessage.length <= MAX_CHAR_LIMIT) {
      setMessage(newMessage);
    } else {
      showAlert(
        `Exceeded ${MAX_CHAR_LIMIT} characters, please shorten your message.`,
        'alert'
      );
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative mx-auto w-full max-w-full md:max-w-[500px] lg:max-w-[640px] p-4 ${className}`}
      >
        <div
          className={`relative flex bg-gray-700 rounded-2xl p-3 w-full ${className}`}
        >
          <motion.button
            className="mr-2 text-gray-400 hover:text-white transition duration-200 p-2 rounded-full flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(true)}
            aria-label="More options"
          >
            <MoreVertical size={20} />
          </motion.button>

          <textarea
            value={message}
            onChange={handleMessageChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Chat with ${char.name}`}
            className="flex-1 w-full bg-transparent outline-none text-white px-4 py-2 rounded-full focus:ring-0 resize-none overflow-hidden min-w-0"
            rows={1}
            disabled={isGenerating}
          />

          <motion.button
            onClick={sendMessage}
            className={`ml-2 flex items-center gap-1 text-gray-400 transition duration-200 px-4 py-2 rounded-full flex-shrink-0 ${
              !message.trim() || message.length > MAX_CHAR_LIMIT || isGenerating
                ? 'cursor-not-allowed opacity-50'
                : 'hover:text-white'
            }`}
            whileHover={
              message.length <= MAX_CHAR_LIMIT &&
              !isGenerating &&
              message.trim()
                ? { scale: 1.05 }
                : {}
            }
            whileTap={
              message.length <= MAX_CHAR_LIMIT &&
              !isGenerating &&
              message.trim()
                ? { scale: 0.95 }
                : {}
            }
            aria-label="Send message"
            disabled={
              !message.trim() || message.length > MAX_CHAR_LIMIT || isGenerating
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={
                  isGenerating
                    ? 'Generating'
                    : message.trim()
                      ? 'send'
                      : 'continue'
                }
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : message.trim().length > 0 ? (
                  <Send size={20} />
                ) : (
                  <ArrowRight size={20} />
                )}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {message.trim().length > 0 && (
                <motion.span
                  key={isGenerating ? 'Generating' : 'Send'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium"
                >
                  {isGenerating ? 'Generating...' : 'Send'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {isMenuOpen && (
        <Menu onClose={() => setIsMenuOpen(false)} char={char as Character} />
      )}
    </>
  );
}
