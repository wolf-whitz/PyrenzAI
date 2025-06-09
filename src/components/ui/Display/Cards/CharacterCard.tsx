import { useState, useEffect, useCallback } from 'react';
import { CharacterCardModal } from '@components';
import { Character } from '@shared-types';
import { Box, Typography, Fade } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
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
  PyrenzCharacterCardImageImg,
  PyrenzAltTag,
} from '~/theme';

interface CharacterCardProps {
  character: Character;
  isOwner?: boolean;
}

export function CharacterCard({ character, isOwner = false }: CharacterCardProps) {
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
            <PyrenzCharacterCardImageImg
              src={character.profile_image}
              alt={character.name}
            />
          </PyrenzCharacterCardImage>
          <PyrenzCharacterCardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <PyrenzCharacterCardTitle>
                {character.name}
              </PyrenzCharacterCardTitle>
              <Box display={{ xs: 'none', sm: 'none', md: 'flex' }} alignItems="center" gap={0.5}>
                <MessageIcon fontSize="small" sx={{ color: 'white' }} />
                <Typography variant="caption" className="font-medium">
                  {character.chat_messages_count}
                </Typography>
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
                mt: 1,
              }}
              onClick={handleCreatorClick}
            >
              <PyrenzAltTag>@{character.creator}</PyrenzAltTag>

              <Box display={{ xs: 'flex', sm: 'flex', md: 'none' }} alignItems="center" gap={0.5}>
                <MessageIcon fontSize="small" sx={{ color: 'white' }} />
                <Typography variant="caption" className="font-medium">
                  {character.chat_messages_count}
                </Typography>
              </Box>
            </Box>

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
              {Array.isArray(character.tags) &&
                character.tags.slice(0, 5).map((tag, index) => (
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
