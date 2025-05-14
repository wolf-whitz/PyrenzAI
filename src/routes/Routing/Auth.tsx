import { useState, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

export default function Auth() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoaded(true);
    }
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once
    });
  }, []);

  const handleCaptcha = (token: string) => {
    document.cookie =
      'captcha-cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expiration = tomorrow.toUTCString();
    document.cookie = `captcha-cookie=${token}; expires=${expiration}; path=/`;
    navigate('/Home');
  };

  return (
    <main
      className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat font-baloo"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif')",
      }}
    >
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md p-10 rounded-2xl bg-gray-900 bg-opacity-70 shadow-2xl border border-gray-700"
        data-aos="fade-up"
      >
        <Typography
          variant="h4"
          className="text-center text-white mb-8 font-baloo"
        >
          {t('messages.verifyNotBot')}
        </Typography>
        <Box className="flex justify-center flex-col items-center">
          {isLoaded ? (
            <motion.article
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-6"
              data-aos="zoom-in"
            >
              <HCaptcha
                sitekey="91081ab4-7c04-4130-b526-926e81bacae4"
                onVerify={handleCaptcha}
                theme="dark"
              />
            </motion.article>
          ) : (
            <Box className="text-white animate-pulse flex items-center mb-6">
              <CircularProgress size={24} className="mr-2" />
              <Typography>{t('messages.loadingCaptcha')}</Typography>
            </Box>
          )}
          <Typography
            variant="body2"
            className="text-gray-300 text-center mt-4 text-sm font-light"
            data-aos="fade-in"
          >
            {t('messages.pyrenzAIDescription')}
          </Typography>
        </Box>
      </motion.section>
    </main>
  );
}
