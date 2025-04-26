import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LanguageModal } from "@components/index";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { supabase } from "~/Utility/supabaseClient";
import { Utils } from "~/Utility/Utility";
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/language.json')
      .then((response) => response.json())
      .then((data) => {
        setLanguages(data.availableLanguages || []);
      });

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.error('Error fetching session:', error);
        setIsAuthenticated(false);
      } else {
        const userData = await supabase.auth.getUser();
        if (userData.error) {
          console.error('Error fetching user:', userData.error);
        } else {
          setUser(userData.data.user);
          setIsAuthenticated(true);
        }
      }
    };

    fetchUser();
  }, []);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      console.log("Logged out successfully");
      setIsAuthenticated(false);
      setUser(null);
      navigate("/");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await Utils.post('/api/delete-account');
      console.log("Account deleted successfully");
      setIsAuthenticated(false);
      setUser(null);
      navigate("/auth");
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-full">
        <h1 className="text-4xl font-bold text-white">Please log in to access your account settings.</h1>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-4 justify-center items-center h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white">Account</h1>
        <p className="text-lg text-gray-400 mt-2">Manage your login and account settings</p>
      </div>

      {user && (
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.user_metadata?.avatar_url || ''}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <span className="text-white text-lg">{user.user_metadata?.full_name || user.email}</span>
        </div>
      )}

      <div className="text-center p-6 bg-opacity-50 rounded-lg max-w-md w-full flex justify-between items-center">
        <span className="text-white">Language</span>
        <motion.button
          onClick={toggleModal}
          className="text-white hover:text-blue-500 transition duration-200"
          whileHover={{ scaleX: -1 }}
          transition={{ duration: 0.1 }}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-6 w-6" />
        </motion.button>
      </div>

      <div className="text-center p-6 bg-opacity-50 rounded-lg max-w-md w-full flex justify-between items-center">
        <span className="text-white">Log Out</span>
        <motion.button
          onClick={handleLogOut}
          className="text-white hover:text-blue-500 transition duration-200"
          whileHover={{ scaleX: -1 }}
          transition={{ duration: 0.1 }}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-6 w-6" />
        </motion.button>
      </div>

      <div className="text-center p-6 bg-opacity-50 rounded-lg max-w-md w-full flex justify-between items-center">
        <span className="text-white">Delete Account</span>
        <motion.button
          onClick={handleDeleteAccount}
          className="text-white hover:text-blue-500 transition duration-200"
          whileHover={{ scaleX: -1 }}
          transition={{ duration: 0.1 }}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-6 w-6" />
        </motion.button>
      </div>

      <LanguageModal
        languages={languages}
        isOpen={isModalOpen}
        onClose={toggleModal}
      />
    </motion.div>
  );
}
