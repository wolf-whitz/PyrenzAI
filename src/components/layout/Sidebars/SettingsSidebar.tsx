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
  const [personaData, setPersonaData] = useState<PersonaCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [userUuid, setUserUuid] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserUuid = async () => {
      const uuid = await GetUserUUID();
      setUserUuid(uuid);
    };

    fetchUserUuid();
  }, []);

  const fetchPersona = async () => {
    if (!userUuid) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('persona_name, persona_description, persona_profile');

      if (error) {
        throw error;
      }

      const mappedData = data.map((item) => ({
        id: item.persona_profile,
        name: item.persona_name,
        description: item.persona_description,
      }));

      setPersonaData(mappedData);
    } catch (error) {
      console.error('Failed to fetch persona data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (settingsOpen && userUuid) {
      fetchPersona();
    }
  }, [settingsOpen, userUuid]);

  const updatePersonaData = (newPersona: PersonaCard) => {
    setPersonaData((prevData) => [...prevData, newPersona]);
  };

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
        <Persona
          personaData={personaData}
          loading={loading}
          updatePersonaData={updatePersonaData}
        />
      </Box>
    </Drawer>
  );
}
