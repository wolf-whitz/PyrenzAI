import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Button, Box, Slide, Fade } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import * as Sentry from '@sentry/react';

export function ErrorPage() {
  const location = useLocation();

  useEffect(() => {
    Sentry.captureException(new Error(`Page not found: ${location.pathname}`));
  }, [location]);

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={600}>
      <div
        className="h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif)`,
        }}
      >
        <Fade in={true} timeout={600}>
          <Container
            className="text-white text-center p-6 bg-black bg-opacity-70 rounded-lg max-w-md mx-auto shadow-lg"
            maxWidth="sm"
          >
            <Box className="flex items-center justify-center mb-4">
              <ErrorOutlineIcon
                style={{ fontSize: 40, color: '#FF5733', marginRight: '8px' }}
              />
              <Typography variant="h4" component="h2" className="font-bold">
                Oops! This page doesn’t exist.
              </Typography>
            </Box>
            <Typography
              variant="body1"
              component="div"
              className="text-xl mb-4"
            >
              The path <strong>{location.pathname}</strong> is not registered.
            </Typography>
            <Typography
              variant="body1"
              component="div"
              className="text-lg mb-6"
            >
              Go back to{' '}
              <Button
                href="/"
                variant="contained"
                color="primary"
                className="text-white bg-blue-500 hover:bg-blue-600"
                sx={{
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  transition: 'transform 0.3s ease',
                }}
              >
                Home
              </Button>{' '}
              and try again!
            </Typography>
          </Container>
        </Fade>
      </div>
    </Slide>
  );
}
