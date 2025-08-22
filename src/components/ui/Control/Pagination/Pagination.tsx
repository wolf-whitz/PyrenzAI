import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onNext: () => void;
  onPrev: () => void;
}

export function Pagination({
  totalPages,
  currentPage,
  onNext,
  onPrev,
}: PaginationProps) {
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
          onClick={onPrev}
          disabled={currentPage <= 1}
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
          onClick={onNext}
          disabled={currentPage >= totalPages}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Typography variant="button">Next</Typography>
          <ChevronRightIcon />
        </IconButton>
      </motion.div>
    </Box>
  );
}
