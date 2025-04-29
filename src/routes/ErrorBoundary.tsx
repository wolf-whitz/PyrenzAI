import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Typography, Button } from '@mui/material';

export default function ErrorBoundary() {
  const location = useLocation();

  return (
    <motion.div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <Container
        className="text-white text-center p-6 bg-black bg-opacity-50 rounded-lg max-w-md mx-auto font-baloo"
        maxWidth="sm"
      >
        <Typography variant="h4" component="h2" className="mb-4">
          Oops! This page doesn’t exist.
        </Typography>
        <Typography variant="body1" className="text-xl mb-4">
          The path <strong>{location.pathname}</strong> is not registered.
        </Typography>
        <Typography variant="body1" className="text-lg">
          Go back to{' '}
          <Button href="/" className="text-blue-400 underline">
            Home
          </Button>{' '}
          and try again!
        </Typography>
      </Container>
    </motion.div>
  );
}
