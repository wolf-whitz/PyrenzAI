import { useHomeStore } from '~/store';
import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { fetchCharacters } from '@function';
import * as Sentry from '@sentry/react';
import { usePyrenzAlert } from '~/provider';

interface LoadMoreProps {
  itemsPerPage: number;
  search: string;
}

export function Pagination({ itemsPerPage, search }: LoadMoreProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const currentPage = useHomeStore((state) => state.currentPage);
  const setCurrentPage = useHomeStore((state) => state.setCurrentPage);
  const setCharacters = useHomeStore((state) => state.setCharacters);
  const showAlert = usePyrenzAlert();

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const nextPage = currentPage + 1;

      const newCharacters = await fetchCharacters({
        currentPage: nextPage,
        itemsPerPage,
        search,
      });

      if (newCharacters.length > 0) {
        setCurrentPage(nextPage);
        const currentCharacters = useHomeStore.getState().characters;
        setCharacters([...currentCharacters, ...newCharacters]);
      } else {
        setHasMore(false);
        showAlert('No more characters to load.', 'Success');
      }
    } catch (error) {
      console.error('Error loading characters:', error);
      Sentry.captureException(error);
      showAlert('Error loading more characters.', 'Alert');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
        <Button
          variant="outlined"
          onClick={handleLoadMore}
          disabled={isLoading || !hasMore}
          sx={{
            color: '#fff',
            borderColor: '#add8e6',
            borderRadius: '9999px',
            padding: '0.5rem 1.5rem',
            cursor: isLoading || !hasMore ? 'not-allowed' : 'pointer',
            '&:hover': {
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.04)',
            },
          }}
          aria-label="Load More Characters"
        >
          {isLoading ? 'Loading...' : hasMore ? 'Load More' : 'No More Characters To Load'}
        </Button>
      </motion.div>
    </Box>
  );
}
