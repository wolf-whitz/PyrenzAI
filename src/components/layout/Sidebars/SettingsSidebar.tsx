import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Persona, GetUserUUID, GetUserData } from '@components';
import { PyrenzStyledDrawer } from '~/theme';

interface SettingsSidebarProps {
  settingsOpen: boolean;
  onClose: () => void;
}

export function SettingsSidebar({
  settingsOpen,
  onClose,
}: SettingsSidebarProps) {
  const [user, setUser] = useState({ username: '', icon: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await GetUserData();
        if ('error' in userData) {
          console.error('Error fetching user:', userData.error);
        } else {
          setUser({
            username: userData.username,
            icon: userData.icon,
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <PyrenzStyledDrawer
      isOpen={settingsOpen}
      onClose={onClose}
      profileData={{
        name: user.username,
        avatarUrl: user.icon,
      }}
    >
      <Box className="flex justify-center">
        <img
          src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/Support.avif"
          alt="Support Us"
          className="rounded-lg max-w-full h-auto select-none pointer-events-none shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow-hover"
        />
      </Box>

      <Box className="flex justify-center mt-4">
        <Persona />
      </Box>
    </PyrenzStyledDrawer>
  );
}
