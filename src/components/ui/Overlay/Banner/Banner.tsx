import { motion } from 'framer-motion';
import { Box, Typography, Fade } from '@mui/material';
import Typewriter from 'typewriter-effect';

export function Banner() {
  return (
    <Fade in={true} timeout={500}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 rounded-3xl mb-4 flex justify-center items-center h-36 font-baloo text-white border-none relative bg-cover bg-center w-full"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif)`,
        }}
      >
        <Typography
          variant="h4"
          className="text-3xl font-bold relative z-10 text-center w-full"
          style={{ transition: 'opacity 0.3s ease-in-out' }}
        >
          <Typewriter
            options={{
              strings: ['PyrenzAI', 'Support Us', 'Join our discord server!'],
              autoStart: true,
              loop: true,
              delay: 100,
              deleteSpeed: 30,
            }}
          />
        </Typography>
      </Box>
    </Fade>
  );
}
