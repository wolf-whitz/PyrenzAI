import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, CircularProgress } from '@mui/material';

type SpinnerBaseProps = {
  message: React.ReactNode;
  subMessage?: React.ReactNode;
  no_bg?: boolean;
};

const SpinnerBase = ({ message, subMessage, no_bg = false }: SpinnerBaseProps) => (
  <motion.div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '16px',
      backgroundColor: no_bg ? 'transparent' : 'black',
      color: 'white',
      textAlign: 'center',
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <CircularProgress style={{ color: 'blue' }} />
    <Typography variant="body1" style={{ marginTop: '16px', animation: 'pulse 2s infinite' }}>
      {message}
    </Typography>
    {subMessage && (
      <Typography variant="body2" style={{ marginTop: '8px', color: 'gray' }}>
        {subMessage}
      </Typography>
    )}
  </motion.div>
);

const Spinner = () => (
  <SpinnerBase
    message={
      <>
        Loading <span style={{ fontWeight: '600', color: 'blue' }}>Pyrenz</span>, Open Source, Free Alternative
      </>
    }
  />
);

const ChatPageSpinner = () => (
  <SpinnerBase
    message={
      <>
        Loading.. Please Wait While{' '}
        <span style={{ fontWeight: '600', color: 'blue' }}>Pyrenz</span> loads your chats.
      </>
    }
    subMessage="It may take a few seconds."
    no_bg
  />
);

const SettingsPageLoader = () => (
  <SpinnerBase
    message={
      <>
        Loading.. Please Wait While{' '}
        <span style={{ fontWeight: '600', color: 'blue' }}>Pyrenz</span> loads your settings.
      </>
    }
    subMessage="It may take a few seconds."
    no_bg
  />
);

export { Spinner, ChatPageSpinner, SettingsPageLoader };
