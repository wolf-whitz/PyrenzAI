import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaPlus, FaCog, FaComments, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { LoginModal } from '@components/index';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function Sidebar({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    checkUser();
  }, []);

  const menuItems = [
    { name: 'Home', icon: <FaHome size={20} />, path: '/Home' },
    { name: 'Create', icon: <FaPlus size={20} />, path: '/Create' },
    { name: 'Chats', icon: <FaComments size={20} />, path: '/Chats' },
    { name: 'Settings', icon: <FaCog size={20} />, path: '/Settings' },
  ];

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
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
                name: 'Profile',
                icon: (
                  <img
                    src={user.user_metadata?.avatar_url}
                    alt="Avatar"
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
              name: 'Profile',
              icon: (
                <img
                  src={user.user_metadata?.avatar_url}
                  alt="Avatar"
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

      <Dialog.Root open={showLoginModal} onOpenChange={setShowLoginModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
            <LoginModal onClose={handleCloseLoginModal} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
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
  const handleClick = () => {
    if (
      ['Settings', 'Profile', 'Chats', 'Create'].includes(item.name) &&
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
  const handleClick = () => {
    if (
      ['Settings', 'Profile', 'Chats', 'Create'].includes(item.name) &&
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
