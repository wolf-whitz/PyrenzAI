import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import { AppRoutes } from '~/routes/routes';
import { Spinner } from '@components';
import { supabase } from './Utility/supabaseClient';
import { usePyrenzAlert } from '~/provider';
import { useUserStore } from '~/store';
import { Box, useTheme } from '@mui/material';

const AppContent = () => {
  const navigate = useNavigate();
  const showAlert = usePyrenzAlert();
  const [loading, setLoading] = useState(true);
  const setIsDeleted = useUserStore((state) => state.setIsDeleted);
  const theme = useTheme();
  const currentTheme = theme.palette.mode;

  useEffect(() => {
    const checkUserStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('user_data')
          .select('is_deleted')
          .eq('user_uuid', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
          return;
        }

        if (data?.is_deleted) {
          showAlert(
            'Your account is deleted. Please contact an admin to immediately open your account.',
            'alert'
          );
          setIsDeleted(true);
          await supabase.auth.signOut();
        } else {
          setIsDeleted(false);
        }
      }
      setLoading(false);
    };

    checkUserStatus();
  }, [navigate, showAlert, setIsDeleted]);

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
