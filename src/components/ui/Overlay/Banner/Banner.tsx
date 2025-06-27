import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import Typewriter from 'typewriter-effect';

export function Banner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="p-4 rounded-3xl mb-4 flex justify-center items-center h-36 text-white border-none relative bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif)`,
        width: '100%',
        flexGrow: 0,
        flexShrink: 0,
      }}
    >
      <Typography
        variant="h4"
        className="text-3xl font-bold relative z-10 text-center w-full"
        style={{ transition: 'opacity 0.3s ease-in-out' }}
      >
        <Typewriter
          options={{
            strings: [
              'PyrenzAI',
              'Get Pyrenz+ Now~!',
              'Support Us',
              'Join our discord server!',
            ],
            autoStart: true,
            loop: true,
            delay: 100,
            deleteSpeed: 30,
          }}
        />
      </Typography>
    </motion.div>
  );
}
