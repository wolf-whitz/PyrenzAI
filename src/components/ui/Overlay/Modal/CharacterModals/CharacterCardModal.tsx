import { useState } from 'react';
import { useCharacterModalApi } from '@api';
import { Character } from '@shared-types';
import { Button, Typography, CircularProgress, Box } from '@mui/material';
import { motion } from 'framer-motion';
import {
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  MessageOutlined as MessageIcon,
  PublicOutlined as PublicIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';
import { ShimmerText } from 'react-shimmer-effects';
import { PyrenzModal, PyrenzModalContent, PyrenzBlueButton } from '~/theme';

interface CharacterCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character | null;
  isOwner: boolean;
  onCharacterDeleted: () => void;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export function CharacterCardModal({
  isOpen,
  onClose,
  character,
  isOwner,
  onCharacterDeleted,
}: CharacterCardModalProps) {
  const {
    isLoading,
    handleCreatorClick,
    handleChatNow,
    handleEditCharacter,
    handleDeleteCharacter,
  } = useCharacterModalApi({ character, isOwner, onClose, onCharacterDeleted });

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!character) return null;

  return (
    <PyrenzModal open={isOpen} onClose={onClose}>
      <PyrenzModalContent>
        <Box display="flex" p={2}>
          <motion.img
            src={character.profile_image}
            alt={character.name}
            style={{
              width: '96px',
              height: '128px',
              objectFit: 'cover',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              marginRight: '16px',
              boxShadow: '0 0 8px rgba(0,0,0,0.4)',
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1, transition: { delay: 0.1, duration: 0.3 } }}
          />

          <Box flex={1} display="flex" flexDirection="column">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                {character.name}
              </Typography>

              {isOwner && (
                <Box>
                  <PyrenzBlueButton
                    onClick={handleEditCharacter}
                    startIcon={<EditIcon fontSize="small" />}
                    style={{ color: 'white', marginLeft: '8px' }}
                  >
                    Edit
                  </PyrenzBlueButton>
                  <PyrenzBlueButton
                    onClick={handleDeleteCharacter}
                    startIcon={<DeleteIcon fontSize="small" />}
                    style={{ color: 'white', marginLeft: '8px' }}
                  >
                    Delete
                  </PyrenzBlueButton>
                </Box>
              )}
            </Box>

            <Typography
              variant="caption"
              style={{
                color: 'white',
                marginTop: '4px',
                cursor: 'pointer',
              }}
              onClick={handleCreatorClick}
            >
              @{character.creator}
            </Typography>

            <Typography
              variant="body2"
              style={{
                color: 'white',
                marginTop: '16px',
                opacity: 0.9,
                cursor: 'pointer',
              }}
              onClick={toggleExpand}
            >
              {isExpanded
                ? character.description || 'No description available.'
                : truncateText(
                    character.description || 'No description available.',
                    100
                  )}
            </Typography>

            <Box display="flex" alignItems="center" mt={3}>
              <PyrenzBlueButton
                variant="contained"
                onClick={handleChatNow}
                disabled={isLoading}
                style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                }}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? <ShimmerText line={1} gap={10} /> : 'Chat Now'}
              </PyrenzBlueButton>
              <Box display="flex" alignItems="center" ml={2}>
                <MessageIcon fontSize="small" style={{ color: 'white' }} />
                <Typography variant="caption" style={{ marginLeft: '4px' }}>
                  {character.chat_messages_count}
                </Typography>
              </Box>
            </Box>

            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              {character.is_public !== undefined && (
                <motion.span
                  className="text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
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
                character.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    className="text-xs font-semibold py-1 px-3 rounded-full"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    }}
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
        </Box>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
