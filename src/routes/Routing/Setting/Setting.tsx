import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@components';
import { supabase } from '~/Utility/supabaseClient';
import { User } from '@supabase/supabase-js';
import {
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function lazyNamed<T>(
  factory: () => Promise<{ [key: string]: T }>,
  exportName: string
) {
  return lazy(() =>
    factory().then((mod) => ({ default: (mod as any)[exportName] }))
  );
}

const Account = lazyNamed(() => import('./Items/Account'), 'Account');
const Profile = lazyNamed(() => import('./Items/Profile'), 'Profile');
const Preference = lazyNamed(() => import('./Items/Preference'), 'Preference');
const Persona = lazyNamed(() => import('./Items/Persona'), 'Persona');

export function Setting() {
  const [activeTab, setActiveTab] = useState<
    'account' | 'profile' | 'preference' | 'persona'
  >('account');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleTabs, setVisibleTabs] = useState([
    'account',
    'profile',
    'preference',
    'persona',
  ]);
  const [startIndex, setStartIndex] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
          setIsAuthenticated(false);
        } else {
          setUser(userData.data.user);
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: 'account' | 'profile' | 'preference' | 'persona'
  ) => {
    setActiveTab(newValue);
  };

  const handleNext = () => {
    if (startIndex < visibleTabs.length - 3) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full min-h-[300px]">
          <CircularProgress />
        </div>
      );
    }

    if (!isAuthenticated && activeTab === 'account') {
      return (
        <div className="flex justify-center items-center h-full min-h-[300px]">
          <Typography variant="h6" color="textSecondary">
            Please log in to access your account settings.
          </Typography>
        </div>
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
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-3 flex flex-col items-center">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          {isSmallScreen && (
            <IconButton
              onClick={handlePrevious}
              disabled={startIndex === 0}
              style={{ position: 'absolute', left: 0 }}
            >
              <NavigateBeforeIcon />
            </IconButton>
          )}
          <motion.div
            initial={{ x: isSmallScreen ? -100 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: isSmallScreen ? 100 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ display: 'flex', overflow: 'hidden' }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {(isSmallScreen
                ? visibleTabs.slice(startIndex, startIndex + 3)
                : visibleTabs
              ).map((tab) => (
                <Tab
                  key={tab}
                  label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                  value={tab}
                />
              ))}
            </Tabs>
          </motion.div>
          {isSmallScreen && (
            <IconButton
              onClick={handleNext}
              disabled={startIndex >= visibleTabs.length - 3}
              style={{ position: 'absolute', right: 0 }}
            >
              <NavigateNextIcon />
            </IconButton>
          )}
        </div>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full">
              <CircularProgress />
            </div>
          }
        >
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full flex justify-center items-center"
          >
            <div className="max-w-md w-full">{renderContent()}</div>
          </motion.div>
        </Suspense>
      </div>
    </div>
  );
}
