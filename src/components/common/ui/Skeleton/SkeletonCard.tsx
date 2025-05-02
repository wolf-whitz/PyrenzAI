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
      style={{
        width: '100%',
        minHeight: '360px',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #374151',
        backgroundColor: '#1f2937',
        marginBottom: '16px',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '192px',
          backgroundColor: '#374151',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      ></motion.div>

      <Box sx={{ p: 3 }}>
        <motion.div
          style={{
            height: '24px',
            backgroundColor: '#4b5563',
            width: '75%',
            marginBottom: '8px',
            borderRadius: '4px',
          }}
          initial={{ width: 0 }}
          animate={{ width: isLoaded ? '75%' : 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        ></motion.div>

        <motion.div
          style={{
            height: '16px',
            backgroundColor: '#4b5563',
            width: '100%',
            marginBottom: '8px',
            borderRadius: '4px',
          }}
          initial={{ width: 0 }}
          animate={{ width: isLoaded ? '100%' : 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        ></motion.div>

        <motion.div
          style={{
            height: '16px',
            backgroundColor: '#4b5563',
            width: '66.67%',
            marginBottom: '8px',
            borderRadius: '4px',
          }}
          initial={{ width: 0 }}
          animate={{ width: isLoaded ? '66.67%' : 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        ></motion.div>

        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              style={{
                height: '24px',
                backgroundColor: '#4b5563',
                width: '64px',
                borderRadius: '9999px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
            ></motion.div>
          ))}
        </Box>

        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', color: '#9ca3af', fontSize: '12px' }}>
          <motion.div
            style={{
              height: '20px',
              width: '48px',
              backgroundColor: '#4b5563',
              borderRadius: '4px',
            }}
            initial={{ width: 0 }}
            animate={{ width: isLoaded ? '48px' : 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          ></motion.div>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div
              style={{
                height: '20px',
                width: '20px',
                backgroundColor: '#4b5563',
                borderRadius: '9999px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            ></motion.div>
            <motion.div
              style={{
                height: '20px',
                width: '20px',
                backgroundColor: '#4b5563',
                borderRadius: '9999px',
              }}
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
