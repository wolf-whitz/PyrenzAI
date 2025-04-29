import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Fade } from '@mui/material';
import 'tailwindcss/tailwind.css';

export default function Banner() {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'Pyrenz Ai';
  const typingSpeed = 80;
  const resetTime = 3000;

  const getRandomChar = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return chars[Math.floor(Math.random() * chars.length)];
  };

  useEffect(() => {
    let index = 0;
    let typingTimeout: NodeJS.Timeout;
    let restartTimeout: NodeJS.Timeout;

    const typeText = () => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev.slice(0, -1) + getRandomChar());

        setTimeout(() => {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
          typingTimeout = setTimeout(typeText, typingSpeed);
        }, typingSpeed / 2);
      } else {
        restartTimeout = setTimeout(startTyping, resetTime);
      }
    };

    const startTyping = () => {
      index = 0;
      setDisplayedText('');
      setTimeout(typeText, 800);
    };

    typeText();

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(restartTimeout);
    };
  }, []);

  useEffect(() => {
    const cursorBlink = setInterval(() => setShowCursor((prev) => !prev), 500);
    return () => clearInterval(cursorBlink);
  }, []);

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
        <Typography variant="h4" className="text-3xl font-bold relative z-10 text-center w-full">
          {displayedText}
          <motion.span
            className="ml-1"
            animate={{ opacity: showCursor ? 1 : 0 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'loop' }}
          >
            |
          </motion.span>
        </Typography>
      </Box>
    </Fade>
  );
}
