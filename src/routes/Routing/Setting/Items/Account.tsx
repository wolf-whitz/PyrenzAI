import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LanguageModal } from '@components/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '~/Utility/supabaseClient';
import { Utils } from '~/Utility/Utility';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Container, Typography, Box } from '@mui/material';

export default function Account() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
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
      } else {
        const userData = await supabase.auth.getUser();
        if (userData.error) {
          console.error('Error fetching user:', userData.error);
        } else {
          setUser(userData.data.user);
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
      console.log('Logged out successfully');
      setUser(null);
      navigate('/');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await Utils.post('/api/delete-account');
      console.log('Account deleted successfully');
      setUser(null);
      navigate('/auth');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white' }}
    >
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1">
          Account
        </Typography>
        <Typography variant="subtitle1" style={{ color: '#cbd5e0', marginTop: '0.5rem' }}>
          Manage your login and account settings
        </Typography>
      </Box>

      {user && (
        <Box display="flex" alignItems="center" gap={2} mb={6}>
          <Avatar src={user.user_metadata?.avatar_url || ''} alt="Profile" />
          <Typography variant="body1">
            {user.user_metadata?.full_name || user.email}
          </Typography>
        </Box>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        bgcolor="rgba(255, 255, 255, 0.1)"
        borderRadius="0.5rem"
        maxWidth="md"
        width="100%"
      >
        <Typography variant="body1">
          Language
        </Typography>
        <motion.div whileHover={{ scaleX: -1 }} transition={{ duration: 0.1 }}>
          <Button
            onClick={toggleModal}
            style={{ color: '#fff', minWidth: 0 }}
            startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
          />
        </motion.div>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        bgcolor="rgba(255, 255, 255, 0.1)"
        borderRadius="0.5rem"
        maxWidth="md"
        width="100%"
      >
        <Typography variant="body1">
          Log Out
        </Typography>
        <motion.div whileHover={{ scaleX: -1 }} transition={{ duration: 0.1 }}>
          <Button
            onClick={handleLogOut}
            style={{ color: '#fff', minWidth: 0 }}
            startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
          />
        </motion.div>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        bgcolor="rgba(255, 255, 255, 0.1)"
        borderRadius="0.5rem"
        maxWidth="md"
        width="100%"
      >
        <Typography variant="body1">
          Delete Account
        </Typography>
        <motion.div whileHover={{ scaleX: -1 }} transition={{ duration: 0.1 }}>
          <Button
            onClick={handleDeleteAccount}
            style={{ color: '#fff', minWidth: 0 }}
            startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
          />
        </motion.div>
      </Box>

      <LanguageModal
        languages={languages}
        isOpen={isModalOpen}
        onClose={toggleModal}
      />
    </motion.div>
  );
}
