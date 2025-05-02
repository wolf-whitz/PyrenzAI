import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { Modal, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

interface Language {
  code: string;
  name: string;
}

interface LanguageModalProps {
  languages: Language[];
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageModal({
  languages,
  isOpen,
  onClose,
}: LanguageModalProps) {
  const { t } = useTranslation();

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className="bg-black bg-opacity-50"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        className="bg-black p-6 rounded-lg max-w-lg w-full text-white font-baloo"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold mb-4 text-center">
          {t('LanguageModal.selectLanguage')}
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="contained"
              onClick={() => changeLanguage(lang.code)}
              style={{
                backgroundColor: '#1F2937',
                color: '#FFFFFF',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#374151')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#1F2937')
              }
            >
              {lang.name}
            </Button>
          ))}
        </div>
        <div className="flex justify-center gap-4">
          <Button
            variant="contained"
            style={{
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#059669')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#10B981')
            }
          >
            {t('LanguageModal.requestLanguage')}
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: '#F59E0B',
              color: '#FFFFFF',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#D97706')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#F59E0B')
            }
          >
            {t('LanguageModal.foundGrammarIssue')}
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
}
