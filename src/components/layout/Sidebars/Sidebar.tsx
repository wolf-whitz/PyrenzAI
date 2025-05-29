import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  Home as HomeIcon,
  Add as PlusIcon,
  Settings as SettingsIcon,
  Chat as MessageSquareIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { AuthenticationModal } from '@components';
import {
  Tooltip,
  Drawer,
  List,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export function Sidebar({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    checkUser();
  }, []);

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

  const toggleModalMode = () => {
    setModalMode((prevMode) => (prevMode === 'login' ? 'register' : 'login'));
  };

  return (
    <>
      {!isMobile && (
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(
              'w-16 md:w-16 lg:w-20 bg-gray-900 text-white flex-col justify-between p-4 rounded-r-3xl shadow-lg z-50 hidden md:flex',
              className
            ),
          }}
        >
          <List>
            {menuItems.slice(0, 2).map((item) => (
              <SidebarItem
                key={item.name}
                item={item}
                hovered={hovered}
                setHovered={setHovered}
                navigate={navigate}
                setShowLoginModal={setShowLoginModal}
                user={user}
              />
            ))}
          </List>
          <List>
            {menuItems.slice(2).map((item) => (
              <SidebarItem
                key={item.name}
                item={item}
                hovered={hovered}
                setHovered={setHovered}
                navigate={navigate}
                setShowLoginModal={setShowLoginModal}
                user={user}
              />
            ))}
          </List>
        </Drawer>
      )}

      {showLoginModal && (
        <AuthenticationModal
          mode={modalMode}
          onClose={() => setShowLoginModal(false)}
          toggleMode={toggleModalMode}
        />
      )}
    </>
  );
}

function SidebarItem({
  item,
  hovered,
  setHovered,
  navigate,
  setShowLoginModal,
  user,
}: any) {
  const { t } = useTranslation();

  const handleClick = () => {
    if (
      [t('navigation.settings'), t('navigation.create')].includes(item.name) &&
      !user
    ) {
      setShowLoginModal(true);
    } else {
      navigate(item.path);
    }
  };

  return (
    <Tooltip title={item.name} placement="right" arrow>
      <IconButton
        className={clsx(
          'relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg cursor-pointer',
          hovered === item.name && 'bg-transparent'
        )}
        onClick={handleClick}
        onMouseEnter={() => setHovered(item.name)}
        onMouseLeave={() => setHovered(null)}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
      </IconButton>
    </Tooltip>
  );
}
