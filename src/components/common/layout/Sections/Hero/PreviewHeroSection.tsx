import { motion } from 'framer-motion';
import { RefObject } from 'react';

interface HeroSectionProps {
  openModal: () => void;
  pyrenzAiRef: RefObject<HTMLElement>;
}

export default function HeroSection({ openModal, pyrenzAiRef }: HeroSectionProps) {
  return (
    <motion.section
      ref={pyrenzAiRef}
      data-aos="fade-up"
      className="flex flex-col justify-center items-center min-h-screen text-white -mt-16 px-4"
    >
      <h1 className="text-7xl font-semibold mb-4 text-center">Pyrenz AI</h1>
      <p className="text-2xl opacity-80 text-center max-w-xl">
      Chat with unlimited characters, create your own, and have an absolute blast!      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 bg-dark-red text-white px-8 py-3 rounded w-full max-w-xs hover:bg-red-900 transition-colors duration-300 animate-shimmer"
        onClick={openModal}
        aria-label="Get Started"
      >
        Get Started
      </motion.button>
    </motion.section>
  );
}
