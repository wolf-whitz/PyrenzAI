import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

export function SkeletonCard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="w-full min-h-[360px] rounded-lg shadow-md border border-gray-600 bg-gray-800 mb-4 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        className="w-full h-48 bg-gray-600 rounded-t-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      ></motion.div>

      <Box sx={{ p: 3 }}>
        <motion.div
          className="h-6 bg-gray-500 w-3/4 mb-2 rounded"
          initial={{ width: 0 }}
          animate={{ width: isLoaded ? '75%' : 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        ></motion.div>

        <motion.div
          className="h-4 bg-gray-500 w-full mb-2 rounded"
          initial={{ width: 0 }}
          animate={{ width: isLoaded ? '100%' : 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        ></motion.div>

        <motion.div
          className="h-4 bg-gray-500 w-2/3 mb-2 rounded"
          initial={{ width: 0 }}
          animate={{ width: isLoaded ? '66.67%' : 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        ></motion.div>

        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              className="h-6 bg-gray-500 w-16 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
            ></motion.div>
          ))}
        </Box>

        <Box
          sx={{
            mt: 4,
            display: 'flex',
            alignItems: 'center',
            color: '#9ca3af',
            fontSize: '12px',
          }}
        >
          <motion.div
            className="h-5 w-12 bg-gray-500 rounded"
            initial={{ width: 0 }}
            animate={{ width: isLoaded ? '48px' : 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          ></motion.div>
          <Box
            sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <motion.div
              className="h-5 w-5 bg-gray-500 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            ></motion.div>
            <motion.div
              className="h-5 w-5 bg-gray-500 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ delay: 2, duration: 0.5 }}
            ></motion.div>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
