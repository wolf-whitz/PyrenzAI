import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography, Box } from '@mui/material';
import { PersonaModal } from '@components';
import { supabase } from '~/Utility/supabaseClient'; // Updated import path

interface PersonaCard {
  id: string;
  name: string;
  description: string;
}

interface PersonaData {
  persona_name: string;
  persona_description: string;
}

export function Persona() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaCard | null>(null);
  const [personaData, setPersonaData] = useState<PersonaCard[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPersona = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('persona_name, persona_description');

      if (error) {
        throw error;
      }

      const mappedData = data.map((item: PersonaData) => ({
        id: item.persona_name, // Using persona_name as id for simplicity
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
    fetchPersona();
  }, []);

  const handleSelectPersona = (persona: PersonaCard) => {
    setSelectedPersona(persona);
    setModalOpen(false);
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
          Name: {selectedPersona ? selectedPersona.name : 'Anon'}
        </Typography>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setModalOpen(true)}
        className="w-full text-left text-gray-300 px-3 py-2 rounded-md transition hover:bg-gray-700"
      >
        <Typography variant="body1">
          Description:{' '}
          {selectedPersona?.description
            ? selectedPersona.description.length > 100
              ? `${selectedPersona.description.slice(0, 100)}...`
              : selectedPersona.description
            : ''}
        </Typography>
      </motion.button>

      <PersonaModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        loading={loading}
        onSelect={handleSelectPersona}
        personaData={personaData}
      />
    </Box>
  );
}
