import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import { Persona } from '~/components';
import { supabase } from '~/Utility/supabaseClient';
import { useEffect, useState } from 'react';
import { useUserStore } from '~/store/index';

interface SettingsSidebarProps {
  settingsOpen: boolean;
  onClose: () => void;
}

interface PersonaCard {
  id: string;
  name: string;
  description: string;
}

export default function SettingsSidebar({ settingsOpen, onClose }: SettingsSidebarProps) {
  const [personaData, setPersonaData] = useState<PersonaCard[]>([]);
  const [loading, setLoading] = useState(false);
  const { user_uuid } = useUserStore();

  const fetchPersona = async () => {
    if (!user_uuid) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('persona_name, persona_description, persona_profile');

      if (error) {
        throw error;
      }

      const mappedData = data.map(item => ({
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
    if (settingsOpen && user_uuid) {
      fetchPersona();
    }
  }, [settingsOpen, user_uuid]);

  const updatePersonaData = (newPersona: PersonaCard) => {
    setPersonaData((prevData) => [...prevData, newPersona]);
  };

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#111827] bg-opacity-60 backdrop-blur-lg"
          />

          <motion.div
            initial={{ x: '100%', opacity: 0.8, scale: 0.98 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: '100%', opacity: 0.8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="fixed right-0 top-0 h-full w-72 bg-[#111827] shadow-2xl p-6 rounded-l-2xl flex flex-col space-y-6"
          >
            <Box display="flex" justifyContent="center">
              <motion.img
                src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/Support.avif"
                alt="Support Us"
                className="rounded-lg max-w-full h-auto select-none pointer-events-none shadow-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0px 0px 30px rgba(255,255,255,0.2)',
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
      )}
    </AnimatePresence>
  );
}
