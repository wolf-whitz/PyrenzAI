import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonCard, CharacterCard } from '~/components';
import { Typography, Box } from '@mui/material';

const MemoizedCharacterCard = memo(CharacterCard);

interface CharacterListProps {
  characters: CharacterCardProps[];
  loading: boolean;
  itemsPerPage: number;
  t: (key: string, options?: Record<string, any>) => string;
}

interface CharacterCardProps {
  id: string;
  char_uuid: string;
  name: string;
  description: string;
  creator: string | null;
  creator_uuid: string;
  chat_messages_count: number;
  profile_image: string;
  tags: string[];
  is_public: boolean;
  token_total: number;
  isLoading: boolean;
}

export function CharacterList({
  characters,
  loading,
  itemsPerPage,
  t,
}: CharacterListProps) {
  return (
    <Box
      component={motion.div}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        pb: 4,
        minHeight: '50vh',
        justifyContent: { xs: 'center', sm: 'flex-start' },
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {loading ? (
          Array.from({ length: itemsPerPage }).map((_, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: { xs: '100%', sm: '48%', md: '32%', lg: '24%', xl: '20%' },
              }}
            >
              <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                aria-label={t('ariaLabels.loadingCharacter', {
                  index: i + 1,
                })}
              >
                <SkeletonCard />
              </motion.article>
            </Box>
          ))
        ) : characters.length > 0 ? (
          characters.map((char) => (
            <Box
              key={char.id}
              component={motion.article}
              sx={{
                width: { xs: '100%', sm: '48%', md: '32%', lg: '24%', xl: '20%' },
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
                p: 1,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              aria-labelledby={`character-${char.name}`}
            >
              <MemoizedCharacterCard {...char} />
            </Box>
          ))
        ) : (
          <Box
            component={motion.div}
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              width: '100%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            aria-live="polite"
          >
            <Typography variant="body1">
              {t('messages.noCharactersFound')}
            </Typography>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}
