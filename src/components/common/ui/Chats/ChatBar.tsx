import { motion } from 'framer-motion';
import { Settings, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SettingsSidebar } from '~/components';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as Tooltip from '@radix-ui/react-tooltip';
import Typography from '@mui/material/Typography';

interface ChatbarProps {
  profilePic: string;
  safeName: string;
  setSettingsOpen: (open: boolean) => void;
  className?: string;
}

export default function Chatbar({
  profilePic,
  safeName,
  setSettingsOpen,
  className = '',
}: ChatbarProps) {
  const navigate = useNavigate();
  const [settingsOpen, setLocalSettingsOpen] = useState(false);

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
    setLocalSettingsOpen(true);
  };

  const truncateName = (name: string, maxLength: number) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '..' : name;
  };

  const maxNameLength = 10;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`w-full fixed top-0 left-0 px-4 py-2 bg-gray-900 flex items-center justify-between shadow-lg border-b border-gray-700 z-50 pointer-events-auto ${className}`}
        style={{ height: '56px' }}
      >
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => navigate('/Home')}
                  className="p-1 sm:p-2 md:p-3 text-gray-300 hover:text-white transition duration-200"
                >
                  <ChevronLeft size={22} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content className="bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-lg">
                Go Home
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>

          <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <AvatarPrimitive.Root className="inline-flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center overflow-hidden rounded-full bg-gray-600">
              <AvatarPrimitive.Image
                src={profilePic}
                alt={safeName}
                className="h-full w-full object-cover"
              />
              <AvatarPrimitive.Fallback
                delayMs={600}
                className="text-gray-200"
              >
                {safeName.charAt(0)}
              </AvatarPrimitive.Fallback>
            </AvatarPrimitive.Root>
          </motion.div>

          <Typography
            variant="h6"
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-200 truncate font-baloo"
            noWrap
          >
            {truncateName(safeName, maxNameLength)}
          </Typography>
        </div>

        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleSettingsOpen}
                className="p-2 sm:p-3 md:p-4 text-gray-300 hover:text-white transition duration-200"
              >
                <Settings size={20} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content className="bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-lg">
              Open Settings
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </motion.div>

      {settingsOpen && (
        <SettingsSidebar
          settingsOpen={settingsOpen}
          setSettingsOpen={(open) => {
            setSettingsOpen(open);
            setLocalSettingsOpen(open);
          }}
        />
      )}
    </>
  );
}
