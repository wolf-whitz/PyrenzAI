import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgress } from '@mui/material';

type SpinnerBaseProps = {
  message: React.ReactNode;
  subMessage?: React.ReactNode;
  no_bg?: boolean;
};

const SpinnerBase = ({
  message,
  subMessage,
  no_bg = false,
}: SpinnerBaseProps) => (
  <motion.div
    className={`flex flex-col justify-center items-center h-screen p-4 ${
      no_bg ? 'bg-transparent' : 'bg-black'
    } text-white text-center`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <CircularProgress style={{ color: 'blue' }} />
    <p className="mt-4 animate-pulse">{message}</p>
    {subMessage && <p className="mt-2 text-gray-400">{subMessage}</p>}
  </motion.div>
);

const Spinner = () => (
  <SpinnerBase
    message={
      <>
        Loading <span className="font-baloo text-blue-500">Pyrenz</span>, Open
        Source, Free Alternative
      </>
    }
  />
);

const ChatPageSpinner = () => (
  <SpinnerBase
    message={
      <>
        Loading.. Please Wait While{' '}
        <span className="font-baloo text-blue-500">Pyrenz</span> loads your
        chats.
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
        <span className="font-baloo text-blue-500">Pyrenz</span> loads your
        settings.
      </>
    }
    subMessage="It may take a few seconds."
    no_bg
  />
);

export { Spinner, ChatPageSpinner, SettingsPageLoader };
