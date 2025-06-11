import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography, Box } from '@mui/material';
import { PersonaModal } from '@components';
import { supabase } from '~/Utility/supabaseClient';

interface PersonaCard {
  id: string;
  persona_name: string;
  persona_description: string;
  persona_profile: string;
  is_selected: boolean;
}

export function Persona() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaCard | null>(
    null
  );
  const [personaData, setPersonaData] = useState<PersonaCard[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPersona = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .select(
          'id, persona_name, persona_description, persona_profile, is_selected'
        );

      if (error) {
        throw error;
      }

      const mappedData = data.map((item) => ({
        id: item.id,
        persona_name: item.persona_name,
        persona_description: item.persona_description,
        persona_profile: item.persona_profile,
        is_selected: item.is_selected,
      }));

      setPersonaData(mappedData);

      const selected = mappedData.find((persona) => persona.is_selected);
      if (selected) {
        setSelectedPersona(selected);
      }
    } catch (error) {
      console.error('Failed to fetch persona data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersona();
  }, []);

  const handleSelectPersona = async (persona: PersonaCard) => {
    try {
      await supabase
        .from('personas')
        .update({ is_selected: false })
        .eq('user_uuid', (await supabase.auth.getUser()).data.user?.id);

      await supabase
        .from('personas')
        .update({ is_selected: true })
        .eq('id', persona.id);

      await fetchPersona();

      setSelectedPersona(persona);
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to update persona selection', error);
    }
  };

  const handleDeletePersona = async (personaId: string) => {
    try {
      const { error } = await supabase
        .from('personas')
        .delete()
        .eq('id', personaId);

      if (error) {
        throw error;
      }

      fetchPersona();

      if (selectedPersona?.id === personaId) {
        setSelectedPersona(null);
      }
    } catch (error) {
      console.error('Failed to delete persona', error);
    }
  };

  return (
    <Box className="flex flex-col gap-4">
      <Box className="flex items-center gap-2">
        <User size={24} className="text-gray-400" />
        <Typography variant="h6" className="text-white">
          My Persona
        </Typography>
      </Box>

      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setModalOpen(true)}
        className="w-full text-left text-white font-medium px-3 py-2 rounded-md transition hover:bg-gray-700"
      >
        <Typography variant="body1">
          Name: {selectedPersona ? selectedPersona.persona_name : 'Anon'}
        </Typography>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setModalOpen(true)}
        className="w-full text-left text-gray-300 px-3 py-2 rounded-md transition hover:bg-gray-700"
      >
        <Typography variant="body1">
          Description:{' '}
          {selectedPersona?.persona_description
            ? `${selectedPersona.persona_description.slice(0, 5)}...`
            : ''}
        </Typography>
      </motion.button>

      <PersonaModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        loading={loading}
        onSelect={handleSelectPersona}
        onDelete={handleDeletePersona}
        personaData={personaData}
      />
    </Box>
  );
}
