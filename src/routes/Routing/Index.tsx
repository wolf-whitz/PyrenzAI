import { useEffect, useState, useRef } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { useUserStore as UserStore } from '~/store';
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

export default function Preview() {
  const [showModal, setShowModal] = useState<'login' | 'register' | null>(null);
  const pyrenzAiRef = useRef<HTMLElement>(null);
  const discoverMoreRef = useRef<HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setUserUUID = UserStore((state) => state.setUserUUID);
  const setAuthKey = UserStore((state) => state.setAuthKey);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error.message);
        return;
      }

      if (session) {
        const user_uuid = session.user.id;
        setUserUUID(user_uuid);

        const user_data = {
          email: session.user.email,
          full_name: session.user.user_metadata.full_name,
          avatar_url: session.user.user_metadata.avatar_url,
          phone: session.user.phone,
          last_sign_in_at: session.user.last_sign_in_at,
          user_uuid,
        };

        const { data, error } = await supabase.rpc(
          'handle_user_authentication',
          { user_data }
        );

        if (error) {
          console.error('Error during authentication:', error.message);
          return;
        }

        const authResponse = data;

        if (authResponse.success) {
          if (authResponse.auth_key) {
            setAuthKey(authResponse.auth_key);
          } else {
            console.error('[ERROR]: Auth Key not provided in the response');
          }
        } else {
          console.error('[ERROR]: Authentication failed:', authResponse.error);
        }
      }
    };

    fetchUserData();
  }, [setUserUUID, setAuthKey]);

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
      <div className="fixed top-0 w-full z-50">
        <PreviewHeader
          setShowLogin={() => setShowModal('login')}
          setShowRegister={() => setShowModal('register')}
        />
      </div>

      <div className="pt-20 flex-grow">
        <HeroSection openModal={openModal} pyrenzAiRef={pyrenzAiRef} />
        <DownloadModal isModalOpen={isModalOpen} closeModal={closeModal} />
        <FeaturesSection discoverMoreRef={discoverMoreRef} />
      </div>

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
