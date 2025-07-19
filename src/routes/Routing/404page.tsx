import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { PyrenzBlueButton } from '~/theme';

export function ErrorPage() {
  const location = useLocation();

  useEffect(() => {
    Sentry.captureException(new Error(`Page not found: ${location.pathname}`));
  }, [location]);

  return (
    <Container
      maxWidth="sm"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h1"
        style={{
          fontSize: '8rem',
          color: '#2196f3',
          fontWeight: 900,
        }}
      >
        500
      </Typography>
      <Typography
        variant="h5"
        style={{
          marginTop: '1rem',
          fontWeight: 'bold',
          color: '#2196f3',
        }}
      >
        Something went wrong :(
      </Typography>
      <Typography
        variant="body1"
        style={{
          marginTop: '0.5rem',
          color: '#90caf9',
        }}
      >
        We broke it. That’s on us.
      </Typography>
      <PyrenzBlueButton
        href="/"
        style={{
          marginTop: '2rem',
          textTransform: 'none',
          padding: '10px 48px',
          fontSize: '1rem',
          fontWeight: 'bold',
        }}
      >
        Go Home
      </PyrenzBlueButton>
    </Container>
  );
}
