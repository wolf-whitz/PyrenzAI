import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import { AppRoutes } from '~/routes/routes';
import { Spinner } from '@components';
import { Utils as utils } from '~/Utility';
import { usePyrenzAlert } from '~/provider';
import { useUserStore } from '~/store';
import { Box, useTheme } from '@mui/material';

const AppContent = () => {
  const showAlert = usePyrenzAlert();
  const [loading, setLoading] = useState(true);

  const isDeleted = useUserStore((state) => state.is_deleted);
  const setIsDeleted = useUserStore((state) => state.setIsDeleted);
  const theme = useTheme();
  const currentTheme = theme.palette.mode;

  useEffect(() => {
    const checkUserStatus = async () => {
      if (typeof isDeleted === 'boolean') {
        setLoading(false);
        return;
      }

      try {
        const {
          data: { user },
        } = await utils.db.client.auth.getUser();

        if (user) {
          const result = await utils.db.select<{ is_deleted: boolean }>(
            'user_data',
            'is_deleted',
            null,
            { user_uuid: user.id }
          );

          const data = result?.data?.[0];

          if (data?.is_deleted) {
            showAlert(
              'Your account is deleted. Please contact an admin to immediately open your account.',
              'alert'
            );
            setIsDeleted(true);
            await utils.db.client.auth.signOut();
          } else {
            setIsDeleted(false);
          }
        } else {
          setIsDeleted(false);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setIsDeleted(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [isDeleted, setIsDeleted, showAlert]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box
      data-mui-theme={`theme-${currentTheme}`}
      aria-label="PyrenzAI"
      sx={{
        scrollBehavior: 'smooth',
        scrollbarWidth: 'thin',
        scrollbarColor: 'transparent transparent',
        '&::-webkit-scrollbar': {
          width: 8,
          opacity: 0.2,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::-webkit-scrollbar': {
          opacity: 1,
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(100, 100, 100, 0.4)',
          borderRadius: 10,
          border: '2px solid transparent',
          backgroundClip: 'content-box',
        },
      }}
    >
      <Routes>{AppRoutes}</Routes>
    </Box>
  );
};

export function App() {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <AppContent />
      </Suspense>
    </Router>
  );
}
