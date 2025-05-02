import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Typography, Button, Box } from '@mui/material';
import { AlertCircle } from 'lucide-react';
import * as Sentry from '@sentry/react';

export default function ErrorPage() {
  const location = useLocation();

  useEffect(() => {
    Sentry.captureException(new Error(`Page not found: ${location.pathname}`));
  }, [location]);

  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <Container
        className="text-white text-center p-6 bg-black bg-opacity-70 rounded-lg max-w-md mx-auto shadow-lg"
        maxWidth="sm"
      >
        <Box className="flex items-center justify-center mb-4">
          <AlertCircle size={40} color="#FF5733" className="mr-2" />
          <Typography variant="h4" component="h2" className="font-bold">
            Oops! This page doesn’t exist.
          </Typography>
        </Box>
        <Typography variant="body1" component="div" className="text-xl mb-4">
          The path <strong>{location.pathname}</strong> is not registered.
        </Typography>
        <Typography variant="body1" component="div" className="text-lg mb-6">
          Go back to{' '}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              href="/"
              variant="contained"
              color="primary"
              className="text-white bg-blue-500 hover:bg-blue-600"
            >
              Home
            </Button>
          </motion.div>{' '}
          and try again!
        </Typography>
      </Container>
    </motion.div>
  );
}
