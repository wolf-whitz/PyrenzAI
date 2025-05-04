import { useState, useEffect, useRef } from 'react';
import {
  FaHome,
  FaCompass,
  FaComments,
  FaDiscord,
  FaBars,
  FaGlobe,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '~/Utility/supabaseClient';

interface HeaderProps {
  setShowLogin: (value: boolean) => void;
  setShowRegister: (value: boolean) => void;
}

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

export default function Header({ setShowLogin, setShowRegister }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>(
    []
  );
  const [showMore, setShowMore] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsMounted(true);

    fetch('/Languages/Languages.json')
      .then((response) => response.json())
      .then((data) => {
        if (data.languages && Array.isArray(data.languages)) {
          setLanguages(data.languages);
        } else {
          console.error(
            'Fetched data does not contain a valid languages array:',
            data
          );
        }
      })
      .catch((error) => console.error('Error fetching languages:', error));

    const checkUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
      } else if (error) {
        console.error('Error checking user session:', error);
      }
    };

    checkUserSession();
  }, []);

  const menuItems = [
    { name: t('navigation.home'), icon: FaHome, link: '/Home' },
    { name: t('footer.links.explore'), icon: FaCompass, link: '/Explore' },
    { name: t('navigation.chats'), icon: FaComments, link: '/Chats' },
    {
      name: t('footer.links.discord'),
      icon: FaDiscord,
      link: 'https://discord.com',
      external: true,
    },
  ];

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
    <motion.header
      initial={false}
      animate={isMounted ? 'visible' : 'hidden'}
      exit="hidden"
      variants={menuVariants}
      className="fixed top-0 left-0 w-full bg-black bg-opacity-40 p-4 z-50 transition-opacity duration-500"
    >
      <div className="flex justify-between items-center w-full max-w-screen-xl mx-auto px-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t('navigation.scrollToTop')}
        >
          <img
            src="/favicon.png"
            alt={t('footer.pyrenzLogo')}
            className="h-8 w-8"
          />
          <h1 className="text-2xl font-bold text-white font-baloo-da-2 font-display: swap">
            Pyrenz<span className="text-redorange">AI</span>
          </h1>
        </motion.div>

        <nav aria-label={t('navigation.mainNavigation')}>
          <motion.div
            className="hidden md:flex items-center space-x-6 relative"
            variants={menuVariants}
          >
            {menuItems.map(({ name, icon: Icon, link, external }) => (
              <motion.button
                key={name}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-white font-baloo-da-2 hover:text-[#E03201]"
                onClick={() =>
                  external
                    ? window.open(link, '_blank')
                    : (window.location.href = link)
                }
                aria-label={t('navigation.navigateTo', { name })}
              >
                <Icon size={18} /> {name}
              </motion.button>
            ))}

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
                <FaGlobe size={18} />
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

            {!isLoggedIn && (
              <>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogin(true)}
                  className="text-white font-baloo-da-2 hover:text-[#E03201] transition-all"
                  aria-label={t('buttons.login')}
                >
                  {t('buttons.login')}
                </motion.button>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRegister(true)}
                  className="bg-[#E03201] text-white px-4 py-2 rounded font-baloo-da-2 transition-all hover:bg-[#611600]"
                  aria-label={t('buttons.signUp')}
                >
                  {t('buttons.signUp')}
                </motion.button>
              </>
            )}
          </motion.div>
        </nav>

        <div className="md:hidden relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl focus:outline-none"
            aria-label={t('navigation.toggleMenu')}
            aria-expanded={menuOpen}
          >
            <FaBars />
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={menuVariants}
                className="absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 p-2 max-h-60 overflow-y-auto"
                role="menu"
              >
                {menuItems.map(({ name, icon: Icon, link, external }) => (
                  <motion.button
                    key={name}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded"
                    onClick={() =>
                      external
                        ? window.open(link, '_blank')
                        : (window.location.href = link)
                    }
                    aria-label={t('navigation.navigateTo', { name })}
                    role="menuitem"
                  >
                    <Icon className="inline-block mr-2" /> {name}
                  </motion.button>
                ))}

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative mt-2"
                >
                  <button
                    ref={languageButtonRef}
                    className="flex items-center gap-2 text-white font-baloo-da-2 hover:text-[#E03201] w-full text-left px-4 py-2 hover:bg-gray-800 rounded"
                    onClick={handleLanguageButtonClick}
                    aria-label={t('navigation.changeLanguage')}
                  >
                    <FaGlobe className="inline-block mr-2" />
                    {t('navigation.language')}
                  </button>
                </motion.div>

                {!isLoggedIn && (
                  <>
                    <motion.button
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowLogin(true)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded text-white font-baloo-da-2 hover:text-[#E03201] transition-all mb-2"
                      aria-label={t('buttons.login')}
                      role="menuitem"
                    >
                      {t('buttons.login')}
                    </motion.button>
                    <motion.button
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowRegister(true)}
                      className="block w-full text-left bg-[#E03201] text-white px-4 py-2 rounded font-baloo-da-2 transition-all hover:bg-[#611600]"
                      aria-label={t('buttons.signUp')}
                      role="menuitem"
                    >
                      {t('buttons.signUp')}
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {languageMenuOpen && (
          <motion.div
            ref={languageMenuRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="fixed top-16 right-4 w-48 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 p-2 max-h-60 overflow-y-auto z-50 md:hidden"
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
    </motion.header>
  );
}
