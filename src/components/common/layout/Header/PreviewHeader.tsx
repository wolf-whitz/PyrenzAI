import { useState, useEffect } from 'react';
import {
  FaHome,
  FaCompass,
  FaComments,
  FaDiscord,
  FaBars,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  setShowLogin: (value: boolean) => void;
  setShowRegister: (value: boolean) => void;
}

export default function Header({ setShowLogin, setShowRegister }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuItems = [
    { name: 'Home', icon: FaHome, link: '/Home' },
    { name: 'Explore', icon: FaCompass, link: '/Explore' },
    { name: 'Chats', icon: FaComments, link: '/Chats' },
    {
      name: 'Discord',
      icon: FaDiscord,
      link: 'https://discord.com',
      external: true,
    },
  ];

  return (
    <motion.header
      initial={false}
      animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full bg-black bg-opacity-40 p-4 z-50 transition-opacity duration-500"
    >
      <div className="flex justify-between items-center w-full max-w-screen-xl mx-auto px-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <img src="/favicon.ico" alt="Pyrenz Logo" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-white font-baloo-da-2 font-display: swap">
            Pyrenz<span className="text-redorange">AI</span>
          </h1>
        </motion.div>

        <nav aria-label="Main navigation">
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map(({ name, icon: Icon, link, external }) => (
              <motion.button
                key={name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-white font-baloo-da-2 hover:text-[#E03201]"
                onClick={() =>
                  external
                    ? window.open(link, '_blank')
                    : (window.location.href = link)
                }
                aria-label={`Navigate to ${name}`}
              >
                <Icon size={18} /> {name}
              </motion.button>
            ))}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogin(true)}
              className="text-white font-baloo-da-2 hover:text-[#E03201] transition-all"
              aria-label="Login"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRegister(true)}
              className="bg-[#E03201] text-white px-4 py-2 rounded font-baloo-da-2 transition-all hover:bg-[#611600]"
              aria-label="Sign Up"
            >
              Sign Up
            </motion.button>
          </div>
        </nav>

        <div className="md:hidden relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <FaBars />
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 p-2"
                role="menu"
              >
                {menuItems.map(({ name, icon: Icon, link, external }) => (
                  <motion.button
                    key={name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded"
                    onClick={() =>
                      external
                        ? window.open(link, '_blank')
                        : (window.location.href = link)
                    }
                    aria-label={`Navigate to ${name}`}
                    role="menuitem"
                  >
                    <Icon className="inline-block mr-2" /> {name}
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogin(true)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded text-white font-baloo-da-2 hover:text-[#E03201] transition-all mb-2"
                  aria-label="Login"
                  role="menuitem"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRegister(true)}
                  className="block w-full text-left bg-[#E03201] text-white px-4 py-2 rounded font-baloo-da-2 transition-all hover:bg-[#611600]"
                  aria-label="Sign Up"
                  role="menuitem"
                >
                  Sign Up
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
