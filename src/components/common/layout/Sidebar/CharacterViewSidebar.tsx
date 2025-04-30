import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@mui/material';
import * as Tooltip from '@radix-ui/react-tooltip';
import { FiCopy } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';

interface DesktopSidebarProps {
  className?: string;
  profilePic: string;
  safeName: string;
}

export default function DesktopSidebar({
  className,
  profilePic,
  safeName,
}: DesktopSidebarProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const image = new Image();
    image.src = profilePic;
    image.onload = () => setIsLoading(false);
  }, [profilePic]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ x: '-100%', opacity: 0.8, scale: 0.98 }}
      animate={{ x: 60, opacity: 1, scale: 1 }}
      exit={{ x: '-100%', opacity: 0.8, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`fixed left-0 top-0 h-full w-72 bg-charcoal shadow-2xl z-20 p-6 flex flex-col space-y-6 ${className} hidden md:block`}
    >
      <div className="flex flex-col items-center">
        <Avatar
          src={profilePic}
          alt="Profile"
          sx={{ width: 200, height: 200, borderRadius: '8px' }}
          imgProps={{ style: { objectFit: 'cover' } }}
        />
        <h2 className="text-white text-xl font-bold mt-2">{safeName}</h2>
      </div>

      <div className="flex justify-center mt-4">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleCopyLink}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              >
                <FiCopy className="mr-2" />
                Copy Link
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content className="bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-lg">
              Copy Link
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>

      <div className="flex justify-center mt-4">
        <motion.img
          src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/Support.avif"
          alt="Support Us"
          style={{ borderRadius: '8px', maxWidth: '100%', height: 'auto', pointerEvents: 'none', boxShadow: '0px 0px 30px rgba(255,255,255,0.2)' }}
          whileHover={{
            scale: 1.05,
            boxShadow: '0px 0px 30px rgba(255,255,255,0.2)',
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        />
      </div>

      <Toaster position="bottom-right" />
    </motion.div>
  );
}
