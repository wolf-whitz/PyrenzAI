import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  Home as HomeIcon,
  Add as PlusIcon,
  Settings as SettingsIcon,
  Chat as MessageSquareIcon,
  AccountCircle as UserIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { AuthenticationModal } from '@components/index';
import { Tooltip, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function Sidebar({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <motion.div
        className={clsx(
          'fixed top-0 left-0 h-screen w-16 md:w-16 lg:w-20 bg-gray-900 text-white flex-col justify-between p-4 rounded-r-3xl shadow-lg z-50 hidden md:flex',
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-6">
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
        </div>
        <div className="flex flex-col items-center gap-6">
          {user && (
            <SidebarItem
              item={{
                name: t('navigation.profile'),
                icon: (
                  <img
                    src={user.user_metadata?.avatar_url}
                    alt={t('navigation.avatar')}
                    className="w-12 h-12 rounded-full border-2 border-gray-700"
                  />
                ),
                path: '/Profile',
              }}
              hovered={hovered}
              setHovered={setHovered}
              navigate={navigate}
              setShowLoginModal={setShowLoginModal}
              user={user}
            />
          )}
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
        </div>
      </motion.div>

      <motion.div
        className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around p-2 shadow-lg z-50 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {menuItems.map((item) => (
          <MobileNavItem
            key={item.name}
            item={item}
            navigate={navigate}
            setShowLoginModal={setShowLoginModal}
            user={user}
          />
        ))}
        {user && (
          <MobileNavItem
            item={{
              name: t('navigation.profile'),
              icon: (
                <img
                  src={user.user_metadata?.avatar_url}
                  alt={t('navigation.avatar')}
                  className="w-8 h-8 rounded-full border-2 border-gray-700"
                />
              ),
              path: '/Profile',
            }}
            navigate={navigate}
            setShowLoginModal={setShowLoginModal}
            user={user}
          />
        )}
      </motion.div>

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
      [
        t('navigation.settings'),
        t('navigation.profile'),
        t('navigation.chats'),
        t('navigation.create'),
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
          'relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg hover:bg-gray-800 cursor-pointer',
          hovered === item.name && 'bg-gray-800'
        )}
        onClick={handleClick}
        onMouseEnter={() => setHovered(item.name)}
        onMouseLeave={() => setHovered(null)}
      >
        {item.icon}
      </IconButton>
    </Tooltip>
  );
}

function MobileNavItem({ item, navigate, setShowLoginModal, user }: any) {
  const { t } = useTranslation();

  const handleClick = () => {
    if (
      [
        t('navigation.settings'),
        t('navigation.profile'),
        t('navigation.chats'),
        t('navigation.create'),
      ].includes(item.name) &&
      !user
    ) {
      setShowLoginModal(true);
    } else {
      navigate(item.path);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer"
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
    >
      {item.icon}
      {item.name && <span className="text-xs mt-1">{item.name}</span>}
    </motion.div>
  );
}
