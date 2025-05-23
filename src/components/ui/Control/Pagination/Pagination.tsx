import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { fetchCharacters } from '@components';
import * as Sentry from '@sentry/react';
import { PyrenzAlert } from '@components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  userUUID: string | null;
  setCurrentPage: (page: number) => void;
  t: (key: string) => string;
  searchQuery?: string | null;
}

export function Pagination({
  currentPage,
  itemsPerPage,
  setCurrentPage,
  t,
  searchQuery = '',
}: PaginationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { characters } = await fetchCharacters(
        'character',
        searchQuery || null,
        currentPage + 1,
        itemsPerPage
      );

      if (characters.length > 0) {
        setCurrentPage(currentPage + 1);
      } else {
        PyrenzAlert('No more characters to load.', 'Success');
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
      Sentry.captureException(error);
      PyrenzAlert('Error fetching characters.', 'Alert');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-labelledby="pagination-heading" className="mt-6">
      <h2 id="pagination-heading" className="sr-only">
        {t('ariaLabels.paginationControls')}
      </h2>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="outlined"
          onClick={handleLoadMore}
          disabled={isLoading}
          sx={{
            color: '#fff',
            borderColor: '#add8e6',
            borderRadius: '9999px',
            padding: '0.5rem 1rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            '&:hover': {
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.04)',
            },
          }}
          aria-label={t('ariaLabels.loadMore')}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t('buttons.loadMore')
          )}
        </Button>
      </motion.div>
    </section>
  );
}
