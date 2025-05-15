import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import { Persona } from '~/components';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '~/functions';
import ReactDOM from 'react-dom';

interface SettingsSidebarProps {
  settingsOpen: boolean;
  onClose: () => void;
}

interface PersonaCard {
  id: string;
  name: string;
  description: string;
}

export default function SettingsSidebar({
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

  if (!settingsOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 1500,
          }}
        />

        <motion.div
          initial={{ x: '100%', opacity: 0.8, scale: 0.98 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: '100%', opacity: 0.8, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100%',
            width: '288px',
            backgroundColor: '#111827',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            zIndex: 1500,
          }}
        >
          <Box display="flex" justifyContent="center">
            <motion.img
              src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/Support.avif"
              alt="Support Us"
              style={{
                borderRadius: '8px',
                maxWidth: '100%',
                height: 'auto',
                userSelect: 'none',
                pointerEvents: 'none',
                boxShadow: '0px 0px 20px rgba(255, 255, 255, 0.2)',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0px 0px 30px rgba(255, 255, 255, 0.2)',
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 12 }}
            />
          </Box>

          <Box display="flex" justifyContent="center" mt={4}>
            <Persona
              personaData={personaData}
              loading={loading}
              updatePersonaData={updatePersonaData}
            />
          </Box>
        </motion.div>
      </>
    </AnimatePresence>,
    document.getElementById('sidebar-root')!
  );
}
