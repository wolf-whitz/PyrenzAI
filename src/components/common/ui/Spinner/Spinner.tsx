import { motion } from 'framer-motion';

type SpinnerBaseProps = {
  message: React.ReactNode;
  subMessage?: React.ReactNode;
  no_bg?: boolean;
};

const SpinnerBase = ({ message, subMessage, no_bg = false }: SpinnerBaseProps) => (
  <motion.div
    className={`flex flex-col justify-center items-center h-screen space-y-4 text-white text-center px-4 ${no_bg ? '' : 'bg-black'}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    <p className="text-sm animate-pulse">{message}</p>
    {subMessage && <p className="text-sm mt-2 text-gray-300">{subMessage}</p>}
  </motion.div>
);

const Spinner = () => (
  <SpinnerBase
    message={
      <>
        Loading <span className="font-semibold text-blue-400">Pyrenz</span>, Open Source, Free Alternative
      </>
    }
  />
);

const ChatPageSpinner = () => (
  <SpinnerBase
    message={
      <>
        Loading.. Please Wait While{' '}
        <span className="font-semibold text-blue-400">Pyrenz</span> loads your chats.
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
        <span className="font-semibold text-blue-400">Pyrenz</span> loads your settings.
      </>
    }
    subMessage="It may take a few seconds."
    no_bg
  />
);

export { Spinner, ChatPageSpinner, SettingsPageLoader };
