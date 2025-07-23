import React, { useRef, useEffect } from 'react'
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
  const lockRef = useRef(false)
  const lastPageRef = useRef(currentPage)

  useEffect(() => {
    if (currentPage !== lastPageRef.current) {
      lastPageRef.current = currentPage
      lockRef.current = false
    }
  }, [currentPage])

  const handlePrev = () => {
    if (currentPage > 1 && !isLoading && !lockRef.current) {
      lockRef.current = true
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading && !lockRef.current) {
      lockRef.current = true
      onPageChange(currentPage + 1)
    }
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
