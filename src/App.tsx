import React, { useEffect, useState, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AppRoutes } from '~/routes/routes';
import { Spinner } from '@components';
import { Utils as utils } from '~/Utility';
import { useUserStore } from '~/store';
import { Box, useTheme } from '@mui/material';
import { BlockedPage } from './routes/Routing';
import { HelmetProvider } from 'react-helmet-async';
import { HelmetWrapper } from '~/HelmetWrapper'; 

interface UserData {
  is_deleted: boolean;
}

interface BannedUser {
  is_banned: boolean;
}

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const setIsDeleted = useUserStore((state) => state.setIsDeleted);
  const setIsBanned = useUserStore((state) => state.setIsBanned);
  const theme = useTheme();
  const currentTheme = theme.palette.mode;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initChecks = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const geoData = await res.json();
        const blockedCountries = ['United Kingdom'];

        if (blockedCountries.includes(geoData?.country_name)) {
          setIsBlocked(true);
          if (location.pathname !== '/Blocked') {
            navigate('/Blocked', { replace: true });
          }
          return;
        }

        const user = await utils.db.getUser();

        if (user) {
          const userId = user.id;

          const [deletedRes, bannedRes] = await Promise.all([
            utils.db.select<UserData>({
              tables: 'user_data',
              columns: 'is_deleted',
              match: { user_uuid: userId },
            }),
            utils.db.select<BannedUser>({
              tables: 'banned_users',
              columns: 'is_banned',
              match: { user_uuid: userId },
            }),
          ]);

          const isDeletedUser = deletedRes?.data?.[0]?.is_deleted;
          const isBannedUser = bannedRes?.data?.[0]?.is_banned;

          if (isDeletedUser) {
            setIsDeleted(true);
            await utils.db.client.auth.signOut();
            if (
              location.pathname !== '/Blocked' ||
              location.search !== '?type=deleted'
            ) {
              navigate('/Blocked?type=deleted', { replace: true });
            }
            return;
          } else if (isBannedUser) {
            setIsBanned(true);
            await utils.db.client.auth.signOut();
            if (
              location.pathname !== '/Blocked' ||
              location.search !== '?type=banned'
            ) {
              navigate('/Blocked?type=banned', { replace: true });
            }
            return;
          } else {
            setIsDeleted(false);
            setIsBanned(false);
          }
        } else {
          setIsDeleted(false);
          setIsBanned(false);
        }
      } catch (err) {
        console.error('Init check error:', err);
        setIsDeleted(false);
        setIsBanned(false);
      } finally {
        setLoading(false);
      }
    };

    initChecks();
  }, [location, navigate, setIsDeleted, setIsBanned]);

  if (loading) return <Spinner />;
  if (isBlocked) return <BlockedPage />;

  return (
    <HelmetWrapper>
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
    </HelmetWrapper>
  );
};

export function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<Spinner />}>
          <AppContent />
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}
