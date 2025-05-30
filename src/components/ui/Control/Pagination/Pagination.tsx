import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { fetchCharacters } from '@components';
import * as Sentry from '@sentry/react';
import { usePyrenzAlert } from '~/provider';

interface PaginationProps {
  currentPage: number;
  maxPage: number;
  userUUID: string | null;
  setCurrentPage: (page: number) => void;
  searchQuery?: string | null;
}

export function Pagination({
  currentPage,
  maxPage,
  setCurrentPage,
  searchQuery = '',
}: PaginationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const showAlert = usePyrenzAlert();

  const handlePageChange = async (newPage: number) => {
    if (isLoading || newPage < 1 || newPage > maxPage) return;

    setIsLoading(true);
    try {
      const { characters } = await fetchCharacters(
        'character',
        searchQuery || null,
        newPage
      );

      if (characters.length > 0) {
        setCurrentPage(newPage);
      } else {
        showAlert('No more characters to load.', 'Success');
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
      Sentry.captureException(error);
      showAlert('Error fetching characters.', 'Alert');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-labelledby="pagination-heading" className="mt-6">
      <h2 id="pagination-heading" className="sr-only">
        Pagination Controls
      </h2>
      <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outlined"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={isLoading || currentPage <= 1}
            sx={{
              color: '#fff',
              borderColor: '#add8e6',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              cursor: isLoading || currentPage <= 1 ? 'not-allowed' : 'pointer',
              '&:hover': {
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.04)',
              },
            }}
            aria-label="Previous Page"
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : '<'}
          </Button>
        </motion.div>
        <Typography color="#fff">
          Page {currentPage} of {maxPage}
        </Typography>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outlined"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={isLoading || currentPage >= maxPage}
            sx={{
              color: '#fff',
              borderColor: '#add8e6',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              cursor: isLoading || currentPage >= maxPage ? 'not-allowed' : 'pointer',
              '&:hover': {
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.04)',
              },
            }}
            aria-label="Next Page"
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : '>'}
          </Button>
        </motion.div>
      </Box>
    </section>
  );
}
