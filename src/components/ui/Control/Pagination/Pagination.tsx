import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
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

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1'));

  const setPage = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
  };

  const handlePrev = () => {
    if (currentPage > 1 && !isLoading) {
      setPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      setPage(currentPage + 1);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mt={4}
      gap={2}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          onClick={handlePrev}
          disabled={currentPage <= 1 || isLoading}
        >
          <ChevronLeftIcon />
        </IconButton>
      </motion.div>

      <Typography fontWeight={600}>
        {isLoading
          ? 'Loading Characters...'
          : `Page ${currentPage} out of ${totalPages}`}
      </Typography>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          onClick={handleNext}
          disabled={currentPage >= totalPages || isLoading}
        >
          <ChevronRightIcon />
        </IconButton>
      </motion.div>
    </Box>
  );
}
