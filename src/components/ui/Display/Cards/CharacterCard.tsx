import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CardContent, CharacterCardModal } from '~/components';
import { CharacterCardProps } from '@shared-types/CharacterProp';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import ShareIcon from '@mui/icons-material/Share';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

export function CharacterCard({
  id,
  char_uuid,
  name,
  description,
  creator,
  creator_uuid,
  chat_messages_count,
  profile_image,
  tags = [],
  is_public: isPublic = false,
  token_total,
  isLoading = false,
}: CharacterCardProps & { isLoading: boolean; creator_uuid: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<CharacterCardProps | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = useCallback(() => {
    setModalData({
      id,
      char_uuid,
      name,
      description,
      creator,
      creator_uuid,
      chat_messages_count,
      profile_image,
      tags,
      is_public: isPublic,
      token_total,
      isLoading,
    });
    setIsModalOpen(true);
  }, [
    id,
    char_uuid,
    name,
    description,
    creator,
    creator_uuid,
    chat_messages_count,
    profile_image,
    tags,
    isPublic,
    token_total,
    isLoading,
  ]);

  const handleCreatorClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      navigate(`/profile/${creator_uuid}`);
    },
    [creator_uuid, navigate]
  );

  if (isLoading) {
    return null;
  }

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        className="w-full sm:w-56 min-h-[360px] rounded-xl shadow-lg border border-blue-500 bg-gray-900 text-white font-baloo overflow-hidden cursor-pointer"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        aria-label={`Character card for ${name}`}
      >
        <div className="relative w-full h-48">
          <img
            src={profile_image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
          />
        </div>

        <CardContent className="p-4">
          <Typography variant="h6" className="font-bold truncate">
            {name}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            onClick={handleCreatorClick}
            className="cursor-pointer hover:underline"
          >
            @{creator}
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
            className="mt-2 line-clamp-4"
          >
            {description?.length > 120
              ? `${description.substring(0, 120)}...`
              : description || 'No description available.'}
          </Typography>

          <Box className="mt-3 flex flex-wrap gap-2">
            {isPublic && (
              <Typography
                component="span"
                className="bg-black text-white text-xs font-semibold py-1 px-2 rounded-full flex items-center gap-1"
              >
                <PublicIcon fontSize="small" />
                Public
              </Typography>
            )}
            {!isPublic && (
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
                {chat_messages_count}
              </Typography>
            </Box>

            <Box className="flex items-center ml-auto gap-2">
              <Tooltip title="Copy link">
                <IconButton
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(
                      `${window.location.origin}/characters/${char_uuid}`
                    );
                    alert('Saved');
                  }}
                  aria-label={`Share ${name}`}
                  className="transition-colors duration-200 hover:text-blue-400"
                >
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </motion.div>

      {isModalOpen && modalData && (
        <CharacterCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          character={modalData}
        />
      )}
    </>
  );
}
