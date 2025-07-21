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

export function AppContent() {
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  const {
    cachedUserData,
    setCachedUserData,
    clearCachedUserData,
    setIsDeleted,
    setIsBanned,
  } = useUserStore();

  const theme = useTheme();
  const currentTheme = theme.palette.mode;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const CACHE_TIME_MS = 5 * 60 * 1000;

    const initChecks = async () => {
      try {
        const now = Date.now();
        const cache = cachedUserData;
        const isCacheValid = cache && now - cache.gotten_at < CACHE_TIME_MS;

        if (isCacheValid) {
          const { country_name, is_deleted, is_banned } = cache.data;

          if (country_name === 'United Kingdom') {
            setIsBlocked(true);
            if (location.pathname !== '/Blocked') {
              navigate('/Blocked', { replace: true });
            }
            return;
          }

          if (is_deleted) {
            setIsDeleted(true);
            await utils.db.client.auth.signOut();
            navigate('/Blocked?type=deleted', { replace: true });
            return;
          }

          if (is_banned) {
            setIsBanned(true);
            await utils.db.client.auth.signOut();
            navigate('/Blocked?type=banned', { replace: true });
            return;
          }

          setIsDeleted(false);
          setIsBanned(false);
          return;
        }

        const ipRes = await fetch('https://ipapi.co/json/');
        const geoData = await ipRes.json();
        const blockedCountries = ['United Kingdom'];

        if (blockedCountries.includes(geoData?.country_name)) {
          setCachedUserData({
            data: {
              country_name: geoData.country_name,
              is_deleted: false,
              is_banned: false,
            },
            gotten_at: now,
          });

          setIsBlocked(true);
          if (location.pathname !== '/Blocked') {
            navigate('/Blocked', { replace: true });
          }
          return;
        }

        const { data: { user } } = await utils.db.client.auth.getUser();

        let is_deleted = false;
        let is_banned = false;

        if (user) {
          const userId = user.id;

          const [deletedRes, bannedRes] = await Promise.all([
            utils.db.select<{ is_deleted: boolean }>(
              'user_data',
              'is_deleted',
              null,
              { user_uuid: userId }
            ),
            utils.db.select<{ is_banned: boolean }>(
              'banned_users',
              'is_banned',
              null,
              { user_uuid: userId }
            ),
          ]);

          is_deleted = deletedRes?.data?.[0]?.is_deleted ?? false;
          is_banned = bannedRes?.data?.[0]?.is_banned ?? false;

          if (is_deleted) {
            setIsDeleted(true);
            await utils.db.client.auth.signOut();
            navigate('/Blocked?type=deleted', { replace: true });
            return;
          }

          if (is_banned) {
            setIsBanned(true);
            await utils.db.client.auth.signOut();
            navigate('/Blocked?type=banned', { replace: true });
            return;
          }
        }

        setCachedUserData({
          data: {
            country_name: geoData?.country_name,
            is_deleted,
            is_banned,
          },
          gotten_at: now,
        });

        setIsDeleted(false);
        setIsBanned(false);
      } catch (err) {
        console.error('Init check error:', err);
        setIsDeleted(false);
        setIsBanned(false);
        clearCachedUserData();
      } finally {
        setLoading(false);
      }
    };

    initChecks();
  }, [
    location,
    navigate,
    cachedUserData,
    setCachedUserData,
    clearCachedUserData,
    setIsDeleted,
    setIsBanned,
  ]);

  if (loading) return <Spinner />;
  if (isBlocked) return <BlockedPage />;

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
}

export function App() {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <AppContent />
      </Suspense>
    </Router>
  );
}
