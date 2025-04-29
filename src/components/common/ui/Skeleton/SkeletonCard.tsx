import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Skeleton } from '@mui/material';

export default function SkeletonCard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="w-full min-h-[360px] rounded-lg shadow-lg border border-gray-600 bg-gray-800 mb-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        className="w-full h-48 bg-gray-700 rounded-t-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      ></motion.div>

      <Box className="p-3">
        <motion.div
          className="h-6 bg-gray-600 w-3/4 mb-2 rounded"
          initial={{ width: 0 }}
          animate={{ width: isLoaded ? '75%' : 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        ></motion.div>

        <motion.div
          className="h-4 bg-gray-600 w-full mb-2 rounded"
          initial={{ width: 0 }}
          animate={{ width: isLoaded ? '100%' : 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        ></motion.div>

        <motion.div
          className="h-4 bg-gray-600 w-2/3 mb-2 rounded"
          initial={{ width: 0 }}
          animate={{ width: isLoaded ? '66.67%' : 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        ></motion.div>

        <Box className="mt-3 flex flex-wrap gap-1">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              className="h-6 bg-gray-700 w-16 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
            ></motion.div>
          ))}
        </Box>

        <Box className="mt-4 flex items-center text-gray-400 text-xs">
          <motion.div
            className="h-5 w-12 bg-gray-600 rounded"
            initial={{ width: 0 }}
            animate={{ width: isLoaded ? '48px' : 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          ></motion.div>
          <Box className="ml-auto flex items-center gap-2">
            <motion.div
              className="h-5 w-5 bg-gray-600 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            ></motion.div>
            <motion.div
              className="h-5 w-5 bg-gray-600 rounded-full"
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
