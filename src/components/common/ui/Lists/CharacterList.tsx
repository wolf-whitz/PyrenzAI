import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonCard, CharacterCard } from '~/components';
import { Character } from '@shared-types/CharacterProp';
import { Typography } from '@mui/material';

const MemoizedCharacterCard = memo(CharacterCard);

const transformCharacter = (char: Character): CharacterCardProps => {
  const tagsArray = Array.isArray(char.tags)
    ? char.tags.map((tag) => tag.trim())
    : typeof char.tags === 'string'
      ? char.tags.split(',').map((tag) => tag.trim())
      : [];

  return {
    id: char.id,
    input_char_uuid: char.input_char_uuid,
    name: char.name,
    description: char.description,
    creator: char.creator,
    chat_messages_count: char.chat_messages_count,
    profile_image: char.profile_image,
    tags: tagsArray,
    is_public: char.is_public ?? false,
    token_total: char.token_total,
    isLoading: false,
  };
};

interface CharacterListProps {
  characters: Character[];
  loading: boolean;
  itemsPerPage: number;
  t: (key: string, options?: Record<string, any>) => string;
}

interface CharacterCardProps {
  id: string;
  input_char_uuid: string;
  name: string;
  description: string;
  creator: string | null;
  chat_messages_count: number;
  profile_image: string;
  tags: string[];
  is_public: boolean;
  token_total: number;
  isLoading: boolean;
}

export default function CharacterList({
  characters,
  loading,
  itemsPerPage,
  t,
}: CharacterListProps) {
  return (
    <motion.div
      className="grid w-full gap-x-6 gap-y-4 pb-4 min-h-[50vh]
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {loading ? (
          Array.from({ length: itemsPerPage }).map((_, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
              aria-label={t('ariaLabels.loadingCharacter', {
                index: i + 1,
              })}
            >
              <SkeletonCard />
            </motion.article>
          ))
        ) : characters.length > 0 ? (
          characters.map((char) => (
            <motion.article
              key={char.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="transition-transform hover:scale-105 p-2"
              aria-labelledby={`character-${char.name}`}
            >
              <MemoizedCharacterCard
                {...transformCharacter(char)}
                isLoading={loading}
              />
            </motion.article>
          ))
        ) : (
          <motion.div
            className="text-gray-500 text-center w-full"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="body1">
              {t('messages.noCharactersFound')}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
