import { useState, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utils } from '~/Utility/Utility';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CaptchaVerificationResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export function Auth() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCaptcha = async (token: string) => {
    try {
      const response: CaptchaVerificationResponse = await Utils.post(
        '/api/TokenVerify',
        { token }
      );

      if (response.success && response.token) {
        document.cookie =
          'captcha-cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const expiration = tomorrow.toUTCString();
        document.cookie = `captcha-cookie=${response.token}; expires=${expiration}; path=/`;

        navigate('/Home');
      } else {
        console.error('CAPTCHA verification failed:', response.message);
      }
    } catch (error) {
      console.error('Error verifying CAPTCHA:', error);
    }
  };

  return (
    <main
      className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif')",
      }}
    >
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md p-10 rounded-2xl bg-gray-900 bg-opacity-70 shadow-2xl border border-gray-700"
        data-aos="fade-up"
      >
        <Typography variant="h4" className="text-center text-white mb-8">
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
                sitekey="08c42f04-317c-4166-bb7e-cb7062947de6"
                onVerify={handleCaptcha}
                theme="dark"
              />
              <span className="sr-only">
                Please complete the CAPTCHA to verify you are not a robot.
              </span>
            </motion.article>
          ) : (
            <Box className="text-white animate-pulse flex items-center mb-6">
              <CircularProgress size={24} className="mr-2" />
              <Typography>{t('messages.loadingCaptcha')}</Typography>
              <span className="sr-only">Loading CAPTCHA, please wait.</span>
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
