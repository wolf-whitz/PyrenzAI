import { useState } from 'react';
import { useCharacterModalApi } from '@components';
import { Character } from '@shared-types';
import { Button, Typography, CircularProgress, Box } from '@mui/material';
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

const renderButtons = [
  {
    key: 'edit',
    icon: <EditIcon fontSize="small" />,
    label: 'Edit',
    showCondition: (isOwner: boolean) => isOwner,
    onClickHandler: (handlers: any) => handlers.handleEditCharacter,
  },
  {
    key: 'delete',
    icon: <DeleteIcon fontSize="small" />,
    label: 'Delete',
    showCondition: (isOwner: boolean) => isOwner,
    onClickHandler: (handlers: any) => handlers.handleDeleteCharacter,
  },
];

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
        <Box display="flex" flexDirection="column" p={2} width="100%">
          <img
            src={character.profile_image}
            alt={character.name}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '16px',
              boxShadow: '0 0 8px rgba(0,0,0,0.4)',
            }}
          />
          <Box display="flex" justifyContent="center" gap={2} mb={2}>
            {renderButtons.map((button) =>
              button.showCondition(isOwner) ? (
                <PyrenzBlueButton
                  key={button.key}
                  onClick={() => button.onClickHandler({ handleEditCharacter, handleDeleteCharacter })}
                  startIcon={button.icon}
                  style={{ color: 'white' }}
                >
                  {button.label}
                </PyrenzBlueButton>
              ) : null
            )}
          </Box>
          <Box flex={1} display="flex" flexDirection="column">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                {character.name}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              style={{ color: 'white', marginTop: '4px', cursor: 'pointer' }}
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
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: isExpanded ? 'unset' : 3,
                WebkitBoxOrient: 'vertical',
              }}
              onClick={toggleExpand}
            >
              {character.description || 'No description available.'}
            </Typography>
            <Box display="flex" alignItems="center" mt={3}>
              <PyrenzBlueButton
                variant="contained"
                onClick={handleChatNow}
                disabled={isLoading}
                style={{ flex: 1, backgroundColor: '#3B82F6' }}
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
                <Box
                  className="text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1"
                  sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
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
                </Box>
              )}
              {character.tags && character.tags.map((tag, index) => (
                <Box
                  key={index}
                  className="text-xs font-semibold py-1 px-3 rounded-full"
                  sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                >
                  {tag}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
