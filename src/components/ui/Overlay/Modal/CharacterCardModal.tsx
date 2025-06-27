import { useState } from 'react';
import { useCharacterModalApi } from '@api';
import { Character } from '@shared-types';
import {
  Modal,
  Backdrop,
  Fade,
  Button,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  MessageOutlined as MessageIcon,
  PublicOutlined as PublicIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';
import { ShimmerText } from 'react-shimmer-effects';

interface CharacterCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character | null;
  isOwner: boolean;
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
}: CharacterCardModalProps) {
  const {
    isLoading,
    handleCreatorClick,
    handleChatNow,
    handleEditCharacter,
    handleDeleteCharacter,
  } = useCharacterModalApi({ character, isOwner, onClose });

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!character) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="character-card-modal"
      aria-describedby="character-card-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(40, 45, 55, 0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            color: 'white',
            p: 4,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            width: '90%',
            maxWidth: '600px',
          }}
        >
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

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                {character.name}
              </Typography>

              {isOwner && (
                <>
                  <Button
                    onClick={handleEditCharacter}
                    startIcon={<EditIcon fontSize="small" />}
                    sx={{ color: 'white', ml: 1, textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleDeleteCharacter}
                    startIcon={<DeleteIcon fontSize="small" />}
                    sx={{ color: 'white', ml: 1, textTransform: 'none' }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Box>

            <Typography
              variant="caption"
              color="white"
              sx={{
                mt: 0.5,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={handleCreatorClick}
            >
              @{character.creator}
            </Typography>

            <Typography
              variant="body2"
              color="white"
              sx={{ mt: 2, opacity: 0.9, cursor: 'pointer' }}
              onClick={toggleExpand}
            >
              {isExpanded
                ? character.description || 'No description available.'
                : truncateText(
                    character.description || 'No description available.',
                    100
                  )}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleChatNow}
                disabled={isLoading}
                sx={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  '&:hover': { backgroundColor: '#2563EB' },
                }}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? <ShimmerText line={1} gap={10} /> : 'Chat Now'}
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <MessageIcon fontSize="small" sx={{ color: 'white' }} />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {character.chat_messages_count}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
      </Fade>
    </Modal>
  );
}
