import { useEffect, useState, useRef } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { useUserStore as UserStore } from '~/store';
import {
  PreviewHeader,
  PreviewFooter as Footer,
  LoginModal,
  RegisterModal,
  CardContent,
  CardHeader,
  CardTitle,
  DownloadModal,
} from '~/components';
import '~/styles/Preview.css';
import { motion } from 'framer-motion';
import AOS from 'aos';

const cardData = [
  {
    cardName: 'Smart. Fast. Free.',
    cardImage: 'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/ChattingExample.avif',
    cardDescription:
      'Talk to characters anytime. No delays, no message limits just pure roleplay.',
    imageWidth: 400,
    imageHeight: 300,
  },
  {
    cardName: 'Tools For Creator',
    cardImage: 'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MagicalBook.avif',
    cardDescription:
      'Experience Pyrenz tools unleash your creativity with lorebooks, powerful model customization, and so much more',
    imageWidth: 400,
    imageHeight: 300,
  },
  {
    cardName: 'Unlimited Messages',
    cardImage: 'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/ChattingExample.avif',
    cardDescription:
      'Free or not, welcome to PyrenzAi! We offer unlimited messages for free!',
    imageWidth: 400,
    imageHeight: 300,
  },
];

export default function Preview() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const pyrenzAiRef = useRef(null);
  const discoverMoreRef = useRef(null);
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

    const observer = new IntersectionObserver(
      (entries) => {
        const pyrenzAiEntry = entries.find(
          (entry) => entry.target === pyrenzAiRef.current
        );
        const discoverMoreEntry = entries.find(
          (entry) => entry.target === discoverMoreRef.current
        );

        if (pyrenzAiEntry && pyrenzAiEntry.isIntersecting) {
          setHideHeader(false);
        } else if (discoverMoreEntry && discoverMoreEntry.isIntersecting) {
          setHideHeader(true);
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (pyrenzAiRef.current) {
      observer.observe(pyrenzAiRef.current);
    }

    if (discoverMoreRef.current) {
      observer.observe(discoverMoreRef.current);
    }

    return () => {
      if (pyrenzAiRef.current) {
        observer.unobserve(pyrenzAiRef.current);
      }
      if (discoverMoreRef.current) {
        observer.unobserve(discoverMoreRef.current);
      }
    };
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
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: hideHeader ? -100 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed top-0 w-full z-50"
      >
        <PreviewHeader
          setShowLogin={setShowLogin}
          setShowRegister={setShowRegister}
          hideNavbar={hideHeader}
        />
      </motion.div>

      <div className="pt-20 flex-grow">
        <motion.section
          ref={pyrenzAiRef}
          data-aos="fade-up"
          className="flex flex-col justify-center items-center min-h-screen text-white -mt-16"
        >
          <h1 className="text-7xl font-semibold mb-4 text-center">
            Pyrenz AI
          </h1>
          <p className="text-2xl opacity-80 text-center">
            Enrich Creativity with AI, with advanced tools, let creativity flow
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 bg-red-800 text-white px-8 py-3 rounded w-full max-w-xs hover:bg-red-900 transition-colors duration-300"
            onClick={openModal}
            aria-label="Get Started"
          >
            Get Started
          </motion.button>
        </motion.section>

        <DownloadModal isModalOpen={isModalOpen} closeModal={closeModal} />

        <motion.section
          ref={discoverMoreRef}
          data-aos="fade-up"
          className="p-10 text-white pb-32 md:pb-16"
        >
          <h2 className="text-4xl font-bold mb-8 text-center">Discover More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {cardData.map((card, i) => (
              <motion.div
                key={i}
                data-aos="zoom-in"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 text-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-transform duration-300 border-2 border-red-500 md:max-w-xs mx-auto"
                role="article"
                aria-labelledby={`card-title-${i}`}
                aria-describedby={`card-description-${i}`}
              >
                <CardHeader>
                  <CardTitle id={`card-title-${i}`} className="text-2xl font-semibold p-4">
                    {card.cardName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p id={`card-description-${i}`} className="opacity-90">{card.cardDescription}</p>
                  <img
                    src={card.cardImage}
                    alt={card.cardName}
                    loading="lazy"
                    width={card.imageWidth}
                    height={card.imageHeight}
                    className="mt-4 rounded-lg w-full"
                    aria-hidden="true"
                  />
                </CardContent>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      <motion.div data-aos="fade-up" className="mt-44">
        <Footer />
      </motion.div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
        />
      )}
    </motion.div>
  );
}
