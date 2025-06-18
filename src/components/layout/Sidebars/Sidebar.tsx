import React, { useState } from 'react';
import clsx from 'clsx';
import {
  Home as HomeIcon,
  Add as PlusIcon,
  Settings as SettingsIcon,
  Chat as MessageSquareIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '~/store';
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
import { User } from '@shared-types';

export function Sidebar({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const user_uuid = useUserStore((state) => state.userUUID);
  const username = useUserStore((state) => state.username);
  const user_avatar = useUserStore((state) => state.userIcon);
  const is_login = useUserStore((state) => state.is_login);

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
      name: t('navigation.profile'),
      icon: <AccountCircleIcon fontSize="small" />,
      path: '/Profile',
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

  const getUser = (): User | null => {
    if (is_login && user_uuid) {
      return {
        username: username || 'Anon',
        user_avatar: user_avatar || '',
        user_uuid,
      };
    }
    return null;
  };

  return (
    <>
      {!isMobile && (
        <Drawer
          variant="permanent"
          component="aside"
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
                user={getUser()}
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
                user={getUser()}
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

interface SidebarItemProps {
  item: { name: string; icon: React.ReactNode; path: string };
  hovered: string | null;
  setHovered: (name: string | null) => void;
  navigate: (path: string) => void;
  setShowLoginModal: (show: boolean) => void;
  user: User | null;
}

function SidebarItem({
  item,
  hovered,
  setHovered,
  navigate,
  setShowLoginModal,
  user,
}: SidebarItemProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    if (
      [
        t('navigation.settings'),
        t('navigation.create'),
        t('navigation.chats'),
        t('navigation.profile'),
      ].includes(item.name) &&
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
        <ListItemIcon className="text-white">{item.icon}</ListItemIcon>
      </IconButton>
    </Tooltip>
  );
}
