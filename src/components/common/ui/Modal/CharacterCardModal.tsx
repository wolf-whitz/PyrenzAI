import React, { useState } from 'react';
import { MessageSquare, Globe, Lock, Info } from 'lucide-react';
import { CharacterCardProps } from '@shared-types/CharacterCardPropsTypes';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Utils } from '~/Utility/Utility';
import { useUserStore } from '~/store';
import { WindowAlert } from '~/components';
import posthog from 'posthog-js';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Tooltip,
  CircularProgress,
} from '@mui/material';

interface CharacterCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterCardProps | null;
}

export default function CharacterCardModal({
  isOpen,
  onClose,
  character,
}: CharacterCardModalProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user_uuid, auth_key } = useUserStore();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  if (!character) return null;

  const handleChatNow = async () => {
    if (isLoading || !character?.input_char_uuid) return;

    if (!user_uuid || !auth_key) {
      WindowAlert('error', 'Error: User is not logged in yet');
      return;
    }

    setIsLoading(true);

    const requestData = {
      type: 'createchat',
      character_uuid: character.input_char_uuid,
      user_uuid,
      auth_key,
    };

    try {
      const response = await Utils.post<{ chat_uuid: string }>(
        '/api/Chats',
        requestData
      );

      if (response?.chat_uuid) {
        navigate(`/chat/${response.chat_uuid}`);
      } else {
        console.error('Failed to generate chat_uuid');
        WindowAlert('error', 'Failed to generate chat_uuid');
      }
    } catch (error) {
      console.error('Error generating chat_uuid:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      posthog.capture('Error generating chat_uuid', {
        error: errorMessage,
        character_uuid: character.input_char_uuid,
        user_uuid: user_uuid,
      });

      WindowAlert('error', 'Error: User is not logged in yet');
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
        >
          <motion.div
            className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.8,
              rotate: -8,
              transition: { duration: 0.35, ease: 'easeInOut' },
            }}
          >
            <motion.img
              src={character.image_url}
              alt={character.name}
              className="w-24 h-32 object-cover rounded-lg border-2 border-gray-700 shadow-lg sm:mr-4"
              initial={{ scale: 0.8 }}
              animate={{
                scale: 1,
                transition: { delay: 0.1, duration: 0.3, ease: 'easeOut' },
              }}
            />
            <Box className="flex flex-col items-start sm:items-start flex-1">
              <Box className="flex items-center">
                <Typography variant="h6" className="mt-3 font-bold">
                  {character.name}
                </Typography>
                <Tooltip title="Character Info">
                  <IconButton
                    className="ml-2 text-gray-400 hover:text-white"
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    size="small"
                  >
                    <Info size={18} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="caption" color="textSecondary">
                @{character.creator}
              </Typography>

              <Typography
                variant="body2"
                color="textSecondary"
                className="mt-4 px-2"
              >
                {character.description || 'No description available.'}
              </Typography>

              <Box className="flex items-center mt-4 w-full">
                <Button
                  variant="contained"
                  color="primary"
                  className="flex-1"
                  onClick={handleChatNow}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={24} /> : null}
                >
                  {isLoading ? 'Processing...' : 'Chat Now'}
                </Button>
                <Box className="flex items-center gap-1 ml-4">
                  <MessageSquare size={18} className="text-white" />
                  <Typography variant="caption">
                    {character.chat_messages_count}
                  </Typography>
                </Box>
              </Box>

              <Box className="mt-3 flex flex-wrap justify-start gap-2 w-full">
                {character.is_public !== undefined && (
                  <motion.span
                    className="bg-black text-white text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { delay: 0 },
                    }}
                  >
                    {character.is_public ? (
                      <>
                        <Globe size={14} />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        Private
                      </>
                    )}
                  </motion.span>
                )}
                {character.tags &&
                  character.tags.length > 0 &&
                  character.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      className="bg-black text-white text-xs font-semibold py-1 px-3 rounded-full"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: { delay: (index + 1) * 0.05 },
                      }}
                    >
                      {tag}
                    </motion.span>
                  ))}
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      )}
      {isInfoOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsInfoOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
        >
          <motion.div
            className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl flex flex-col items-start relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.8,
              rotate: -8,
              transition: { duration: 0.35, ease: 'easeInOut' },
            }}
          >
            <Typography variant="h6" className="mb-4">
              Character Info
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {character.name}
            </Typography>
            <Typography variant="body2">
              <strong>Creator:</strong> {character.creator}
            </Typography>
            <Typography variant="body2">
              <strong>Description:</strong> {character.description}
            </Typography>
            <Typography variant="body2">
              <strong>Chat Messages Count:</strong>{' '}
              {character.chat_messages_count}
            </Typography>
            <Typography variant="body2">
              <strong>Tags:</strong> {character.tags.join(', ')}
            </Typography>
            <Typography variant="body2">
              <strong>Public:</strong> {character.is_public ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2">
              <strong>Token Total:</strong> {character.token_total}
            </Typography>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root')!
  );
}
