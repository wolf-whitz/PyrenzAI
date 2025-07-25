import React, { useMemo } from 'react';
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

  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = useMemo(() => {
    if (Number.isNaN(rawPage) || rawPage < 1) return 1;
    if (rawPage > totalPages) return totalPages;
    return rawPage;
  }, [rawPage, totalPages]);

  const setPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(clampedPage));
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
      gap={2}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton onClick={handlePrev} disabled={currentPage <= 1 || isLoading}>
          <ChevronLeftIcon />
        </IconButton>
      </motion.div>

      <Typography fontWeight={600}>
        {isLoading
          ? 'Loading Characters...'
          : `Page ${currentPage} of ${totalPages}`}
      </Typography>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton onClick={handleNext} disabled={currentPage >= totalPages || isLoading}>
          <ChevronRightIcon />
        </IconButton>
      </motion.div>
    </Box>
  );
}
