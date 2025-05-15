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
import { motion } from 'framer-motion';
import AOS from 'aos';
import { Box, Container, GlobalStyles } from '@mui/material';
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
    <>
      <GlobalStyles
        styles={{
          html: {
            scrollBehavior: 'smooth',
          },
          body: {
            scrollBehavior: 'smooth',
          },
        }}
      />
      <Box
        component={motion.section}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/BackgroundTree.avif)`,
        }}
      >
        <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 50 }}>
          <PreviewHeader
            setShowLogin={() => setShowModal('login')}
            setShowRegister={() => setShowModal('register')}
          />
        </Box>

        <Box component="main" sx={{ pt: 20, flexGrow: 1 }}>
          <Container maxWidth={false} disableGutters>
            <HeroSection openModal={openModal} pyrenzAiRef={pyrenzAiRef} />
            <DownloadModal isModalOpen={isModalOpen} closeModal={closeModal} />
            <FeaturesSection discoverMoreRef={discoverMoreRef} />
          </Container>
        </Box>

        <Box component={motion.footer} data-aos="fade-up" sx={{ mt: 44 }}>
          <Footer />
        </Box>

        {showModal && (
          <AuthenticationModal
            mode={showModal}
            onClose={() => setShowModal(null)}
            toggleMode={toggleMode}
          />
        )}
      </Box>
    </>
  );
}
