import React, { useEffect, useState } from 'react';
import { useUserStore } from '~/store';
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Utils } from '~/Utility';
import { PyrenzBlueButton } from '~/theme';
import { Sidebar, MobileNav } from '@components';

interface Admin {
  is_admin: boolean;
}

export function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const userUUID = useUserStore((state) => state.userUUID);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        const { data, error } = await Utils.db.client
          .from('admins')
          .select('is_admin')
          .eq('user_uuid', userUUID)
          .single<Admin>();

        if (error) {
          throw error;
        }

        setIsAdmin(data?.is_admin || false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error checking admin status:', error.message);
        } else {
          console.error('Unknown error occurred:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userUUID) {
      checkAdminStatus();
    }
  }, [userUUID]);

  const handleMaintenanceMode = async () => {
    try {
      const response = await Utils.post('/api/Commands', {
        type: 'Maintenance',
      });
      console.log('Maintenance mode request sent:', response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error sending maintenance mode request:', error.message);
      } else {
        console.error('Unknown error occurred:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="52vh"
      >
        <Typography variant="h6" color="textSecondary">
          Access Denied: Admins Only
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flex: 1 }}>
        {!isMobile && <Sidebar />}
        <Box
          sx={{
            flex: 1,
            p: isMobile ? 2 : 4,
            mb: isMobile ? '56px' : 0,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Admin Panel
          </Typography>
          <PyrenzBlueButton onClick={handleMaintenanceMode} sx={{ mt: 3 }}>
            Maintenance Mode
          </PyrenzBlueButton>
        </Box>
      </Box>
      {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
    </Box>
  );
}
