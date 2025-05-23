import React, { useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import HomeIcon from '@mui/icons-material/Home';
import PlusIcon from '@mui/icons-material/Add';
import MessageSquareIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { ArchiveModal } from '@components';
import { GetUserUUID } from '@components';

type SetShowLoginModal = (show: boolean) => void;

export function MobileNav({ setShowLoginModal }: { setShowLoginModal: SetShowLoginModal }) {
  const { t } = useTranslation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: t('navigation.home'),
      icon: <HomeIcon fontSize="small" />,
      path: '/Home',
    },
    {
      name: t('navigation.create'),
      icon: <PlusIcon fontSize="small" />,
      path: '/Create',
    },
    {
      name: t('navigation.chats'),
      icon: <MessageSquareIcon fontSize="small" />,
      path: '/Archive',
    },
    {
      name: t('navigation.settings'),
      icon: <SettingsIcon fontSize="small" />,
      path: '/Settings',
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const { uuid, user_exists } = await GetUserUUID();
      if (user_exists && uuid) {
        setUser({ id: uuid } as SupabaseUser);
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }} elevation={3}>
        <BottomNavigation showLabels>
          {menuItems.map((item) => (
            <BottomNavigationAction
              key={item.name}
              label={item.name}
              icon={item.icon}
              onClick={() => {
                if (
                  [
                    t('navigation.settings'),
                    t('navigation.create'),
                  ].includes(item.name) &&
                  !user
                ) {
                  setShowLoginModal(true);
                } else if (item.name === t('navigation.chats')) {
                  setShowArchiveModal(true);
                } else {
                  navigate(item.path);
                }
              }}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>

      {showArchiveModal && (
        <ArchiveModal
          open={showArchiveModal}
          onClose={() => setShowArchiveModal(false)}
        />
      )}
    </>
  );
}
