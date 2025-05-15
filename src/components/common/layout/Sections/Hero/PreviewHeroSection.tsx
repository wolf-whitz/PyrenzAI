import { motion } from 'framer-motion';
import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Box, Container } from '@mui/material';

interface HeroSectionProps {
  openModal: () => void;
  pyrenzAiRef: RefObject<HTMLElement>;
}

export default function HeroSection({
  openModal,
  pyrenzAiRef,
}: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <Container
      component={motion.main}
      ref={pyrenzAiRef}
      data-aos="fade-up"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: 'white',
        mt: '-10rem',
        py: '1rem',
        textAlign: 'center',
      }}
    >
      <Box textAlign="center">
        <Typography
          variant="h1"
          sx={{
            fontSize: '4.5rem',
            fontWeight: '600',
            mb: '1rem',
          }}
        >
          {t('hero.title')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.5rem',
            opacity: '0.8',
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          {t('hero.description')}
        </Typography>
      </Box>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="contained"
          sx={{
            mt: '1rem',
            backgroundColor: '#8B0000',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '4px',
            width: 'auto',
            maxWidth: '400px',
            '&:hover': {
              backgroundColor: '#B22222',
            },
            transition: 'background-color 0.3s ease',
          }}
          onClick={openModal}
          aria-label={t('buttons.getStarted')}
        >
          {t('buttons.getStarted')}
        </Button>
      </motion.div>
    </Container>
  );
}
