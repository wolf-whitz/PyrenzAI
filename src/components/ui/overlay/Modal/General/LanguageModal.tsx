import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useCallback } from 'react';
import { PyrenzBlueButton, PyrenzModal, PyrenzModalContent } from '~/theme';

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
    <PyrenzModal open={isOpen} onClose={onClose}>
      <PyrenzModalContent onClick={handleModalClick}>
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
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
