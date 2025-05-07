import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Language as Globe, Laptop, Smartphone, Close as X } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import posthog from 'posthog-js';
import { useTranslation } from 'react-i18next';

interface DownloadModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function DownloadModal({
  isModalOpen,
  closeModal,
}: DownloadModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const buttonsConfig = [
    {
      icon: Globe,
      label: t('platforms.web'),
      link: '/Home',
      is_up: true,
      className: 'w-full border-b-2 border-red-500 pb-4',
      buttonClassName:
        'flex flex-col items-center w-full bg-transparent hover:shadow-glow',
    },
    {
      icon: Laptop,
      label: t('platforms.windows'),
      link: '/Windows',
      is_up: false,
      className: '',
      buttonClassName:
        'flex flex-col items-center bg-black bg-opacity-80 p-3 rounded-lg border-2 border-red-500 w-40 hover:shadow-glow',
    },
    {
      icon: Smartphone,
      label: t('platforms.mobile'),
      link: '/Mobile',
      is_up: false,
      className: '',
      buttonClassName:
        'flex flex-col items-center bg-black bg-opacity-80 p-3 rounded-lg border-2 border-red-500 w-40 hover:shadow-glow',
    },
  ];

  const handleButtonClick = (link: string, label: string, is_up: boolean) => {
    posthog.capture(`${label} Button Clicked`);

    if (is_up) {
      navigate(link);
    } else {
      if (deferredPrompt && (label === t('platforms.mobile') || label === t('platforms.windows'))) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          setDeferredPrompt(null);
        });
      } else {
        window.alert(t('platforms.notUpYet', { label }));
      }
    }
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black bg-opacity-80 p-6 rounded-lg w-96 border-2 border-red-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 gap-6">
              {buttonsConfig[0] &&
                (() => {
                  const Icon = buttonsConfig[0].icon;
                  return (
                    <div className={buttonsConfig[0].className}>
                      <motion.button
                        onClick={() =>
                          handleButtonClick(
                            buttonsConfig[0].link,
                            buttonsConfig[0].label,
                            buttonsConfig[0].is_up
                          )
                        }
                        className={buttonsConfig[0].buttonClassName}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-4xl mb-2 text-white">
                          <Icon />
                        </div>
                        <div className="text-center text-white">
                          {buttonsConfig[0].label}
                        </div>
                      </motion.button>
                    </div>
                  );
                })()}

              <div className="flex flex-row justify-center space-x-4">
                {buttonsConfig.slice(1).map((button, index) => {
                  const Icon = button.icon;
                  return (
                    <motion.button
                      key={index}
                      onClick={() =>
                        handleButtonClick(
                          button.link,
                          button.label,
                          button.is_up
                        )
                      }
                      className={button.buttonClassName}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-2xl mb-2 text-white">
                        <Icon />
                      </div>
                      <div className="text-center text-white">
                        {button.label}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                onClick={closeModal}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded flex items-center justify-center"
                whileHover={{ backgroundColor: '#333' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <X />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root')!
  );
}
