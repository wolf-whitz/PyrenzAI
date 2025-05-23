import { AuthenticationModal, CreateNewChat, GetUserUUID } from '@components';
import { PyrenzAlert } from '@components';
import React, { useState, useEffect, useCallback } from 'react';
import { CharacterCardProps } from '@shared-types/CharacterProp';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import { ShimmerText } from 'react-shimmer-effects';

interface CharacterCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterCardProps | null;
  isOwner: boolean;
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export function CharacterCardModal({
  isOpen,
  onClose,
  character,
  isOwner,
}: CharacterCardModalProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userUUID, setUserUUID] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchUserUUID = async () => {
      try {
        const uuid = await GetUserUUID();
        setUserUUID(uuid);
      } catch (error) {
        console.error('Error fetching user UUID:', error);
        Sentry.captureException(error);
      }
    };

    fetchUserUUID();
  }, []);

  const handleCreatorClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (character?.creator_uuid) {
        navigate(`/profile/${character.creator_uuid}`);
      }
    },
    [character?.creator_uuid, navigate]
  );

  const handleChatNow = async () => {
    if (isLoading || !character?.char_uuid) return;

    if (!userUUID) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await CreateNewChat(
        character.char_uuid,
        userUUID,
        character.profile_image,
        character.description
      );

      if (response?.chat_uuid) {
        navigate(`/chat/${response.chat_uuid}`);
      } else {
        console.error('Failed to generate chat_uuid');
        PyrenzAlert('Failed to generate chat UUID.', 'Alert');
      }
    } catch (error) {
      console.error('Error generating chat_uuid:', error);
      Sentry.captureException(error);
      PyrenzAlert('Error generating chat UUID.', 'Alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCharacter = () => {
    if (character) {
      navigate(`/create/${character.char_uuid}`, { state: { character, isOwner } });
    }
  };

  if (!character) return null;

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.4, ease: 'easeOut' },
              }}
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
                  src={character.profile_image}
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
                    {isOwner && (
                      <Button
                        onClick={handleEditCharacter}
                        aria-label="Edit character"
                        startIcon={<EditIcon fontSize="small" />}
                        sx={{
                          color: 'white',
                          marginLeft: '8px',
                          textTransform: 'none',
                        }}
                      >
                        Edit Character
                      </Button>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    onClick={handleCreatorClick}
                    className="cursor-pointer hover:underline"
                  >
                    @{character.creator}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="mt-4 px-2"
                  >
                    {truncateText(
                      character.description || 'No description available.',
                      100
                    )}
                  </Typography>

                  <Box className="flex items-center mt-4 w-full">
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#3B82F6',
                        '&:hover': {
                          backgroundColor: '#3B82F6',
                        },
                      }}
                      className="flex-1"
                      onClick={handleChatNow}
                      disabled={isLoading}
                      startIcon={
                        isLoading ? <CircularProgress size={24} /> : null
                      }
                    >
                      {isLoading ? (
                        <ShimmerText line={1} gap={10} />
                      ) : (
                        'Chat Now'
                      )}
                    </Button>
                    <Box className="flex items-center gap-1 ml-4">
                      <MessageIcon fontSize="small" className="text-white" />
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
                            <PublicIcon fontSize="small" />
                            Public
                          </>
                        ) : (
                          <>
                            <LockIcon fontSize="small" />
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
        </AnimatePresence>,
        document.getElementById('modal-root')!
      )}
      {showAuthModal && (
        <AuthenticationModal
          onClose={() => setShowAuthModal(false)}
          mode="login"
          toggleMode={() => {}}
        />
      )}
    </>
  );
}
