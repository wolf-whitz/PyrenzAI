import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSearchParams } from 'react-router-dom';

interface PaginationProps {
  totalPages: number;
  isLoading: boolean;
}

export function Pagination({ totalPages, isLoading }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  const setPage = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
  };

  const handlePrev = () => {
    if (!isLoading && currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLoading && currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mt={4}
      gap={4}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          onClick={handlePrev}
          disabled={currentPage <= 1 || isLoading}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ChevronLeftIcon />
          <Typography variant="button">Previous</Typography>
        </IconButton>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          onClick={handleNext}
          disabled={currentPage >= totalPages || isLoading}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Typography variant="button">Next</Typography>
          <ChevronRightIcon />
        </IconButton>
      </motion.div>
    </Box>
  );
}
