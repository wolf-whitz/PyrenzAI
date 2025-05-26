import React, { useEffect, useState } from 'react';
import { Drawer, Box } from '@mui/material';
import { Persona, GetUserUUID } from '@components';
import { supabase } from '~/Utility/supabaseClient';

interface SettingsSidebarProps {
  settingsOpen: boolean;
  onClose: () => void;
}

interface PersonaCard {
  id: string;
  name: string;
  description: string;
}

export function SettingsSidebar({
  settingsOpen,
  onClose,
}: SettingsSidebarProps) {
  const [userUuid, setUserUuid] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserUuid = async () => {
      const uuid = await GetUserUUID();
      setUserUuid(uuid);
    };

    fetchUserUuid();
  }, []);

  return (
    <Drawer
      anchor="right"
      open={settingsOpen}
      onClose={onClose}
      PaperProps={{
        className:
          'w-full sm:w-72 bg-gray-900 text-white p-6 shadow-lg rounded-l-xl',
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
    </Drawer>
  );
}
