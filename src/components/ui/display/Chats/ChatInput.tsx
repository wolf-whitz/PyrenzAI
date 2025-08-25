import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MoreVertOutlined as MoreVertIcon,
  SendOutlined as SendIcon,
} from '@mui/icons-material';
import { CircularProgress, Box, IconButton } from '@mui/material';
import { Menu } from '@components';
import { useChatStore } from '~/store';

interface ChatInputProps {
  className?: string;
  handleSend: (message: string) => void;
  isGenerating: boolean;
}

const MAX_CHAR_LIMIT = 1500;
const MAX_TEXT_AREA_HEIGHT = 200;

export function ChatInput({
  className,
  handleSend,
  isGenerating,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { char } = useChatStore();

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
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        MAX_TEXT_AREA_HEIGHT
      )}px`;
    }
  }, [message]);

  return (
    <>
      <Box
        className={`relative mx-auto w-full max-w-full md:max-w-[500px] lg:max-w-[640px] p-4 ${className}`}
        sx={{
          opacity: 0,
          y: 10,
          animation: 'fadeIn 0.3s ease-out forwards',
          '@keyframes fadeIn': {
            to: {
              opacity: 1,
              y: 0,
            },
          },
        }}
      >
        <Box className="relative flex bg-gray-700 rounded-lg p-3 w-full">
          <IconButton
            className="mr-2 text-gray-400 hover:text-white transition duration-200 p-2 rounded-full flex-shrink-0"
            onClick={() => setIsMenuOpen(true)}
            aria-label="More options"
            sx={{
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

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
            placeholder="Write something..."
            className="flex-1 w-full bg-transparent outline-none text-white px-4 py-2 rounded-lg focus:ring-0 resize-none overflow-auto min-w-0"
            rows={1}
            maxLength={MAX_CHAR_LIMIT}
            disabled={isGenerating}
            style={{ maxHeight: `${MAX_TEXT_AREA_HEIGHT}px` }}
          />

          <IconButton
            onClick={sendMessage}
            className={`ml-2 flex items-center gap-1 text-gray-400 transition duration-200 p-2 rounded-full flex-shrink-0 ${
              !message.trim() || isGenerating
                ? 'cursor-not-allowed opacity-50'
                : 'hover:text-white'
            }`}
            aria-label="Send message"
            disabled={!message.trim() || isGenerating}
            sx={{
              '&:hover':
                !isGenerating && message.trim()
                  ? { transform: 'scale(1.05)' }
                  : {},
              '&:active':
                !isGenerating && message.trim()
                  ? { transform: 'scale(0.95)' }
                  : {},
            }}
          >
            {isGenerating ? (
              <CircularProgress size={20} className="text-white" />
            ) : (
              <SendIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>

      {isMenuOpen && char && (
        <Menu onClose={() => setIsMenuOpen(false)} char={char} />
      )}
    </>
  );
}
