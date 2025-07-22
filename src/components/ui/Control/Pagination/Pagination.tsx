import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { motion } from 'framer-motion'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

interface PaginationProps {
  currentPage: number
  totalPages: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, isLoading, onPageChange }: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1 && !isLoading) onPageChange(currentPage - 1)
  }

  console.log('Current Page:', currentPage, 'Total Pages:', totalPages, 'Is Loading:', isLoading)

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) onPageChange(currentPage + 1)
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={4} gap={2}>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
        <IconButton onClick={handlePrev} disabled={currentPage <= 1 || isLoading}>
          <ChevronLeftIcon />
        </IconButton>
      </motion.div>

      <Typography fontWeight={600}>
        {isLoading ? 'Loading Characters...' : `Page ${currentPage} out of ${totalPages}`}
      </Typography>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
        <IconButton onClick={handleNext} disabled={currentPage >= totalPages || isLoading}>
          <ChevronRightIcon />
        </IconButton>
      </motion.div>
    </Box>
  )
}
