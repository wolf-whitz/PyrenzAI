import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Plus,
  Settings,
  MessageSquare,
  User as LucideUser,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { AuthenticationModal } from '@components/index';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useTranslation } from 'react-i18next';

export default function Sidebar({ className }: { className?: string }) {
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
    { name: t('navigation.home'), icon: <Home size={20} />, path: '/Home' },
    {
      name: t('navigation.create'),
      icon: <Plus size={20} />,
      path: '/Create',
    },
    {
      name: t('navigation.chats'),
      icon: <MessageSquare size={20} />,
      path: '/Chats',
    },
    {
      name: t('navigation.settings'),
      icon: <Settings size={20} />,
      path: '/Settings',
    },
  ];

  const toggleModalMode = () => {
    setModalMode((prevMode) => (prevMode === 'login' ? 'register' : 'login'));
  };

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 h-screen w-16 md:w-16 lg:w-20 bg-gray-900 text-white flex-col justify-between p-4 rounded-r-3xl shadow-lg z-50 ${className} hidden md:flex`}
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
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.div
            className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg hover:bg-gray-800 cursor-pointer"
            onClick={handleClick}
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {item.icon}
          </motion.div>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs shadow-md z-50 pointer-events-auto"
          side="right"
          align="center"
        >
          {item.name}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
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
