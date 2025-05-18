import { useState, useEffect, useRef } from 'react';
import { Language as FaGlobe } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface LanguageDropdownProps {
  languages: { code: string; name: string }[];
}

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

export function LanguageDropdown({ languages }: LanguageDropdownProps) {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguageMenuOpen(false);
  };

  const visibleLanguages = showMore ? languages : languages.slice(0, 5);

  const handleLanguageButtonClick = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (
      languageButtonRef.current &&
      !languageButtonRef.current.contains(event.target as Node) &&
      languageMenuRef.current &&
      !languageMenuRef.current.contains(event.target as Node)
    ) {
      setLanguageMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <button
        ref={languageButtonRef}
        className="flex items-center gap-2 text-white font-baloo-da-2 hover:text-[#E03201]"
        onClick={handleLanguageButtonClick}
        aria-label={t('navigation.changeLanguage')}
      >
        <FaGlobe />
        {t('navigation.language')}
      </button>
      <AnimatePresence>
        {languageMenuOpen && (
          <motion.div
            ref={languageMenuRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="absolute top-full left-0 w-48 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 p-2 max-h-60 overflow-y-auto z-50"
            role="menu"
            onMouseEnter={() => setLanguageMenuOpen(true)}
            onMouseLeave={() => setLanguageMenuOpen(false)}
            onClick={(e) => e.stopPropagation()}
          >
            {visibleLanguages.map(({ code, name }) => (
              <motion.button
                key={code}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded"
                onClick={() => changeLanguage(code)}
                role="menuitem"
              >
                {name}
              </motion.button>
            ))}
            {languages.length > 5 && (
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded text-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMore(!showMore);
                }}
                role="menuitem"
              >
                {showMore ? 'Show Less' : 'Show More'}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
