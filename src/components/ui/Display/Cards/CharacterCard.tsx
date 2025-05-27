import { useState, useEffect, useCallback } from 'react';
import { CharacterCardModal } from '@components';
import { Character } from '@shared-types/CharacterProp';
import { Box, Typography, IconButton, Tooltip, Fade } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import ShareIcon from '@mui/icons-material/Share';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import {
  PyrenzCharacterCard,
  PyrenzCharacterCardContent,
  PyrenzCharacterCardImage,
  PyrenzCharacterCardTitle,
  PyrenzCharacterCardDescription,
  PyrenzCharacterCardTags,
  PyrenzCharacterCardTag,
  PyrenzAltTag,
} from '~/theme';

interface CharacterCardProps {
  character: Character;
  isOwner: boolean;
}

export function CharacterCard({ character, isOwner }: CharacterCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Character | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = useCallback(() => {
    setModalData(character);
    setIsModalOpen(true);
  }, [character]);

  const handleCreatorClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      navigate(`/profile/${character.creator_uuid}`);
    },
    [character.creator_uuid, navigate]
  );

  if (character.isLoading) return null;

  return (
    <>
      <Fade in={isLoaded} timeout={1500}>
        <PyrenzCharacterCard onClick={handleCardClick}>
          <PyrenzCharacterCardImage>
            <img src={character.profile_image} alt={character.name} />
          </PyrenzCharacterCardImage>
          <PyrenzCharacterCardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <PyrenzCharacterCardTitle>
                {character.name}
              </PyrenzCharacterCardTitle>
              <Box display="flex" alignItems="center" gap={1}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <MessageIcon fontSize="small" sx={{ color: 'white' }} />
                  <Typography variant="caption" className="font-medium">
                    {character.chat_messages_count}
                  </Typography>
                </Box>
                <Tooltip title="Copy link">
                  <IconButton
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(
                        `${window.location.origin}/characters/${character.char_uuid}`
                      );
                      alert('Saved');
                    }}
                    aria-label={`Share ${character.name}`}
                    sx={{
                      transition: 'color 0.2s',
                      '&:hover': { color: 'blue' },
                    }}
                  >
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <PyrenzAltTag
              onClick={handleCreatorClick}
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              @{character.creator}
            </PyrenzAltTag>

            <PyrenzCharacterCardDescription>
              {character.description?.length > 120
                ? `${character.description.substring(0, 120)}...`
                : character.description || 'No description available.'}
            </PyrenzCharacterCardDescription>

            <PyrenzCharacterCardTags>
              {character.is_public ? (
                <PyrenzCharacterCardTag>
                  <PublicIcon fontSize="small" />
                  Public
                </PyrenzCharacterCardTag>
              ) : (
                <PyrenzCharacterCardTag>
                  <LockIcon fontSize="small" />
                  Private
                </PyrenzCharacterCardTag>
              )}
              {character.tags
                ?.slice(0, 10)
                .map((tag, index) => (
                  <PyrenzCharacterCardTag key={index}>
                    {tag}
                  </PyrenzCharacterCardTag>
                ))}
            </PyrenzCharacterCardTags>
          </PyrenzCharacterCardContent>
        </PyrenzCharacterCard>
      </Fade>

      {isModalOpen && modalData && (
        <CharacterCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          character={modalData}
          isOwner={isOwner}
        />
      )}
    </>
  );
}
