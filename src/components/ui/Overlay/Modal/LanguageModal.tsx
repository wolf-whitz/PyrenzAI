import { Modal, Typography, Box, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useCallback } from 'react';
import { PyrenzBlueButton } from '~/theme';

interface Language {
  code: string;
  name: string;
}

interface LanguageModalProps {
  languages: Language[];
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageModal({
  languages,
  isOpen,
  onClose,
}: LanguageModalProps) {
  const { t } = useTranslation();

  const changeLanguage = useCallback(
    (code: string) => {
      i18n.changeLanguage(code);
      onClose();
    },
    [onClose]
  );

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Fade in={isOpen}>
        <Box
          onClick={handleModalClick}
          sx={{
            backgroundColor: 'rgba(24, 24, 24, 0.65)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '16px',
            padding: '2rem',
            width: '90%',
            maxWidth: 480,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
            color: '#f1f1f1',
            fontFamily: 'pyrenzfont',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              marginBottom: '1.5rem',
              textAlign: 'center',
              color: '#ffffff',
            }}
          >
            {t('LanguageModal.selectLanguage')}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              mb: 2,
            }}
          >
            {languages.map((lang) => (
              <PyrenzBlueButton
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                sx={{
                  borderRadius: 0,
                  textTransform: 'none',
                  fontWeight: 500,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scaleX(1.05)',
                  },
                }}
              >
                {lang.name}
              </PyrenzBlueButton>
            ))}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
