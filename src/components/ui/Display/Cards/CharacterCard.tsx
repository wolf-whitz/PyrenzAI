import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CharacterCardModal } from '@components';
import { Character } from '@shared-types/CharacterProp';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import ShareIcon from '@mui/icons-material/Share';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

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

  if (character.isLoading) {
    return null;
  }

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        aria-label={`Character card for ${character.name}`}
      >
        <Card
          className="w-full sm:w-56 min-h-[360px] rounded-xl shadow-lg border border-[#add8e6] bg-gray-900 text-white font-baloo overflow-hidden cursor-pointer"
          sx={{ backgroundColor: 'background.paper' }}
        >
          <div className="relative w-full h-48">
            <img
              src={character.profile_image}
              alt={character.name}
              className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
            />
          </div>

          <CardContent className="p-4">
            <Typography variant="h6" className="font-bold truncate">
              {character.name}
            </Typography>
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
              className="mt-2 line-clamp-4"
            >
              {character.description?.length > 120
                ? `${character.description.substring(0, 120)}...`
                : character.description || 'No description available.'}
            </Typography>

            <Box className="mt-3 flex flex-wrap gap-2">
              {character.is_public && (
                <Typography
                  component="span"
                  className="bg-black text-white text-xs font-semibold py-1 px-2 rounded-full flex items-center gap-1"
                >
                  <PublicIcon fontSize="small" />
                  Public
                </Typography>
              )}
              {!character.is_public && (
                <Typography
                  component="span"
                  className="bg-black text-white text-xs font-semibold py-1 px-2 rounded-full flex items-center gap-1"
                >
                  <LockIcon fontSize="small" />
                  Private
                </Typography>
              )}
            </Box>

            <Box className="mt-4 flex items-center text-gray-400 text-xs">
              <Box className="flex items-center gap-1">
                <MessageIcon fontSize="small" className="text-white" />
                <Typography variant="caption" className="font-medium">
                  {character.chat_messages_count}
                </Typography>
              </Box>

              <Box className="flex items-center ml-auto gap-2">
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
                    className="transition-colors duration-200 hover:text-blue-400"
                  >
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

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
