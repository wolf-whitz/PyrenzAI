import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MoreVertical, Loader2, Mic } from 'lucide-react';
import { Menu } from '@components';
import { Character } from '@shared-types';
import { usePyrenzAlert } from '~/provider';

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    isFinal: boolean;
    [key: number]: {
      transcript: string;
    };
  }[];
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
}

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
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const showAlert = usePyrenzAlert();

  const sendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    handleSend(trimmedMessage);
    setMessage('');
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, MAX_TEXT_AREA_HEIGHT)}px`;
    }
  }, [message]);

  const toggleListening = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showAlert('Speech recognition is not supported in your browser.', 'alert');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setMessage(finalTranscript || interimTranscript);
      };

      recognition.start();
      recognitionRef.current = recognition;
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
        <div className={`relative flex bg-gray-700 rounded-lg p-3 w-full ${className}`}>
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

          <motion.button
            onClick={toggleListening}
            className={`mr-2 text-gray-400 hover:text-white transition duration-200 p-2 rounded-full flex-shrink-0 ${
              isListening ? 'text-blue-500' : ''
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isListening ? "Stop recording" : "Record voice"}
          >
            <Mic size={20} />
          </motion.button>

          <motion.button
            onClick={sendMessage}
            className={`ml-2 flex items-center gap-1 text-gray-400 transition duration-200 p-2 rounded-full flex-shrink-0 ${
              !message.trim() || isGenerating
                ? 'cursor-not-allowed opacity-50'
                : 'hover:text-white'
            }`}
            whileHover={
              !isGenerating && message.trim()
                ? { scale: 1.05 }
                : {}
            }
            whileTap={
              !isGenerating && message.trim()
                ? { scale: 0.95 }
                : {}
            }
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
          </motion.button>
        </div>
      </motion.div>

      {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)} char={char as Character} />}
    </>
  );
}
