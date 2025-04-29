import { MessageSquare, Share2, Globe, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardContent, CharacterCardModal } from '~/components';
import { CharacterCardProps } from '@shared-types/CharacterCardPropsTypes';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';

export default function CharacterCard({
  id,
  input_char_uuid,
  name,
  description,
  creator,
  chat_messages_count,
  image_url,
  tags = [],
  public: isPublic = false,
  token_total,
}: CharacterCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<CharacterCardProps | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = () => {
    setModalData({
      id,
      input_char_uuid,
      name,
      description,
      creator,
      chat_messages_count,
      image_url,
      tags,
      public: isPublic,
      token_total,
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        className="w-full sm:w-56 min-h-[360px] rounded-xl shadow-lg border border-gray-600 bg-gray-900 text-white font-baloo overflow-hidden cursor-pointer"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        aria-label={`Character card for ${name}`}
      >
        <div className="relative w-full h-48">
          <img
            src={image_url}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
          />
        </div>

        <CardContent className="p-3">
          <Typography variant="h6" className="font-bold truncate">
            {name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            @{creator}
          </Typography>

          <Typography variant="body2" color="textSecondary" className="mt-2 line-clamp-4">
            {description?.length > 120
              ? `${description.substring(0, 120)}...`
              : description || 'No description available.'}
          </Typography>

          <Box className="mt-3 flex flex-wrap gap-1">
            {isPublic && (
              <Typography
                component="span"
                className="bg-black text-white text-[10px] font-semibold py-1 px-2 rounded-full flex items-center gap-1"
              >
                <Globe size={12} />
                Public
              </Typography>
            )}
            {!isPublic && (
              <Typography
                component="span"
                className="bg-black text-white text-[10px] font-semibold py-1 px-2 rounded-full flex items-center gap-1"
              >
                <Lock size={12} />
                Private
              </Typography>
            )}
            {Array.isArray(tags) &&
              tags.map((tag, index) => (
                <Typography
                  key={index}
                  component="span"
                  className="bg-black text-white text-[10px] font-semibold py-1 px-2 rounded-full"
                >
                  {tag}
                </Typography>
              ))}
          </Box>

          <Box className="mt-4 flex items-center text-gray-400 text-xs">
            <Box className="flex items-center">
              <MessageSquare size={14} className="text-white" />
              <Typography variant="caption" className="font-medium ml-1">
                {chat_messages_count}
              </Typography>
            </Box>

            <Box className="flex items-center ml-auto gap-2">
              <Tooltip title="Copy link">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(
                      `${window.location.origin}/characters/${input_char_uuid}`
                    );
                    alert('Saved')
                  }}
                  aria-label={`Share ${name}`}
                  className="transition-colors duration-200 hover:text-blue-400"
                >
                  <Share2 size={16} />
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
