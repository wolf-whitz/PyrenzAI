import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sidebar, MobileNav } from '@components';
import { supabase } from '~/Utility/supabaseClient';
import { User } from '@supabase/supabase-js';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PyrenzBlueButton } from '~/theme';

const lazyNamed = <T,>(factory: () => Promise<{ [key: string]: T }>, name: string) =>
  lazy(() => factory().then((mod) => ({ default: (mod as any)[name] })));

const tabs = ['account', 'profile', 'persona'] as const;
const tabComponents = {
  account: lazyNamed(() => import('./Items/Account'), 'Account'),
  profile: lazyNamed(() => import('./Items/Profile'), 'Profile'),
  persona: lazyNamed(() => import('./Items/Persona'), 'Persona'),
};

export function Setting() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('account');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) return setLoading(false);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (!userErr && userData?.user) setUser(userData.user);

      setLoading(false);
    };

    init();
  }, []);

  const renderTabs = () => {
    const getTabs = (arr: readonly string[]) =>
      arr.map((tab) => (
        <Tab
          key={tab}
          value={tab}
          label={<PyrenzBlueButton>{tab[0].toUpperCase() + tab.slice(1)}</PyrenzBlueButton>}
        />
      ));

      const mutableTabs = [...tabs]

      const chunkedTabs =
        isMobile ? [mutableTabs.slice(0, 2), mutableTabs.slice(2)] :
        isMedium ? [mutableTabs.slice(0, 3), mutableTabs.slice(3)] :
        [mutableTabs]
      

    return (
      <Box display="flex" flexDirection="column" alignItems="center" width="100%">
        {chunkedTabs.map((chunk, i) => (
          <Tabs
            key={i}
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ width: 'fit-content' }}
          >
            {getTabs(chunk)}
          </Tabs>
        ))}
      </Box>
    );
  };

  const Content = tabComponents[activeTab];

  return (
    <Box display="flex">
      <Sidebar />
      <Box flexGrow={1} p={3} display="flex" flexDirection="column" alignItems="center">
        {renderTabs()}
        <Suspense
          fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
            </Box>
          }
        >
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Box maxWidth="md" width="100%">
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                  <CircularProgress />
                </Box>
              ) : !user && activeTab === 'account' ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                  <Typography variant="h6" color="textSecondary">
                    Please log in to access your account settings.
                  </Typography>
                </Box>
              ) : (
                <Content />
              )}
            </Box>
          </motion.div>
        </Suspense>
      </Box>
      {isMobile && <MobileNav setShowLoginModal={() => {}} />}
    </Box>
  );
}
