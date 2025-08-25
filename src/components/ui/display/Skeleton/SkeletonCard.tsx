import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export function SkeletonCard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.7 }}
        className="w-full min-h-[360px] rounded-lg shadow-md border border-gray-600 bg-gray-800 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full h-48 bg-gray-600 rounded-t-lg"
        ></motion.div>
        <Box sx={{ p: 3 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isLoaded ? '75%' : 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="h-6 bg-gray-500 mb-2 rounded"
          ></motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isLoaded ? '100%' : 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="h-4 bg-gray-500 w-full mb-2 rounded"
          ></motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isLoaded ? '66.66%' : 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="h-4 bg-gray-500 mb-2 rounded"
          ></motion.div>
          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                className="h-6 bg-gray-500 w-16 rounded-full"
              ></motion.div>
            ))}
          </Box>
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              alignItems: 'center',
              color: 'grey.500',
              fontSize: '12px',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isLoaded ? '48px' : 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="h-5 bg-gray-500 rounded"
            ></motion.div>
            <Box
              sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                className="h-5 w-5 bg-gray-500 rounded-full"
              ></motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="h-5 w-5 bg-gray-500 rounded-full"
              ></motion.div>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
