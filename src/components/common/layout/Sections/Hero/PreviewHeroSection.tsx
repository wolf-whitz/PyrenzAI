import { motion } from 'framer-motion';
import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

interface HeroSectionProps {
  openModal: () => void;
  pyrenzAiRef: RefObject<HTMLElement>;
}

export default function HeroSection({ openModal, pyrenzAiRef }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <motion.section
      ref={pyrenzAiRef}
      data-aos="fade-up"
      className="flex flex-col justify-center items-center min-h-screen text-white -mt-16 px-4"
    >
      <h1 className="text-7xl font-semibold mb-4 text-center">
        {t('hero.title')}
      </h1>
      <p className="text-2xl opacity-80 text-center max-w-xl">
        {t('hero.description')}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 bg-dark-red text-white px-8 py-3 rounded w-full max-w-xs hover:bg-red-900 transition-colors duration-300 animate-shimmer"
        onClick={openModal}
        aria-label={t('buttons.getStarted')}
      >
        {t('buttons.getStarted')}
      </motion.button>
    </motion.section>
  );
}
