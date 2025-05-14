import { Utils } from '~/Utility/Utility';
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
import { sendUserDataToUserDataTable } from '~/api';
import { supabase } from '~/Utility/supabaseClient';

interface PostResponse {
  success: boolean;
}

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

    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const userData = {
          userUUID: user.id,
        };

        const response = (await Utils.post(
          '/api/createUserData',
          userData
        )) as PostResponse;

        if (response.success) {
          await sendUserDataToUserDataTable(user);
          return { success: true, user };
        } else {
          console.error('Failed to create user data');
          return { success: false, error: 'Failed to create user data' };
        }
      }
    };

    fetchUserData();
  }, []);

  const toggleMode = () => {
    setShowModal((prevMode) => (prevMode === 'login' ? 'register' : 'login'));
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col font-baloo bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif)`,
      }}
    >
      <Box className="fixed top-0 w-full z-50">
        <PreviewHeader
          setShowLogin={() => setShowModal('login')}
          setShowRegister={() => setShowModal('register')}
        />
      </Box>

      <main className="pt-20 flex-grow">
        <Container maxWidth={false} disableGutters>
          <HeroSection openModal={openModal} pyrenzAiRef={pyrenzAiRef} />
          <DownloadModal isModalOpen={isModalOpen} closeModal={closeModal} />
          <FeaturesSection discoverMoreRef={discoverMoreRef} />
        </Container>
      </main>

      <motion.footer data-aos="fade-up" className="mt-44">
        <Footer />
      </motion.footer>

      {showModal && (
        <AuthenticationModal
          mode={showModal}
          onClose={() => setShowModal(null)}
          toggleMode={toggleMode}
        />
      )}
    </motion.section>
  );
}
