import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { SettingsPageLoader, Sidebar } from '@components/index';
import { supabase } from '~/Utility/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Tabs, Tab, Box, Typography, CircularProgress } from '@mui/material';

const Account = React.lazy(() => import('./Items/Account'));
const Profile = React.lazy(() => import('./Items/Profile'));
const Preference = React.lazy(() => import('./Items/Preference'));
const Persona = React.lazy(() => import('./Items/Persona'));

export default function Setting() {
  const [activeTab, setActiveTab] = useState<'account' | 'profile' | 'preference' | 'persona'>('account');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'account' | 'profile' | 'preference' | 'persona') => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    if (!isAuthenticated && activeTab === 'account') {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" minHeight="300px">
          <Typography variant="h6" color="textSecondary">
            Please log in to access your account settings.
          </Typography>
        </Box>
      );
    }

    switch (activeTab) {
      case 'account':
        return <Account />;
      case 'profile':
        return <Profile />;
      case 'preference':
        return <Preference />;
      case 'persona':
        return <Persona />;
      default:
        return <Account />;
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box flexGrow={1} p={3} display="flex" flexDirection="column" alignItems="center">
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Account" value="account" />
          <Tab label="Profile" value="profile" />
          <Tab label="Preference" value="preference" />
          <Tab label="Persona" value="persona" />
        </Tabs>
        <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height="100%"><CircularProgress /></Box>}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Box maxWidth="md" width="100%">
              {renderContent()}
            </Box>
          </motion.div>
        </Suspense>
      </Box>
    </Box>
  );
}
