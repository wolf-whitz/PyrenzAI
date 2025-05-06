import { useEffect, useState, useRef } from 'react';
import {
  PreviewHeader,
  PreviewFooter as Footer,
  AuthenticationModal,
  DownloadModal,
  HeroSection,
  FeaturesSection,
} from '~/components';
import '~/styles/Preview.css';
import { motion } from 'framer-motion';
import AOS from 'aos';
import { Box, Container } from '@mui/material';

export default function Preview() {
  const [showModal, setShowModal] = useState<'login' | 'register' | null>(null);
  const pyrenzAiRef = useRef<HTMLElement>(null);
  const discoverMoreRef = useRef<HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  const toggleMode = () => {
    setShowModal((prevMode) => (prevMode === 'login' ? 'register' : 'login'));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col font-baloo bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif)`,
      }}
    >
      <Box className="fixed top-0 w-full z-50">
        <PreviewHeader
          setShowLogin={() => setShowModal('login')}
          setShowRegister={() => setShowModal('register')}
        />
      </Box>

      <Container maxWidth={false} disableGutters className="pt-20 flex-grow">
        <HeroSection openModal={openModal} pyrenzAiRef={pyrenzAiRef} />
        <DownloadModal isModalOpen={isModalOpen} closeModal={closeModal} />
        <FeaturesSection discoverMoreRef={discoverMoreRef} />
      </Container>

      <motion.div data-aos="fade-up" className="mt-44">
        <Footer />
      </motion.div>

      {showModal && (
        <AuthenticationModal
          mode={showModal}
          onClose={() => setShowModal(null)}
          toggleMode={toggleMode}
        />
      )}
    </motion.div>
  );
}
