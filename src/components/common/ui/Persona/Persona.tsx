import React, { useState } from 'react';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography, Box } from '@mui/material';
import PersonaModal from '../Modal/PersonaCardModal';

interface PersonaCard {
  id: string;
  name: string;
  description: string;
}

interface PersonaProps {
  personaData: PersonaCard[];
  loading: boolean;
  updatePersonaData: (newPersona: PersonaCard) => void;
}

export default function Persona({ personaData, loading }: PersonaProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaCard | null>(
    null
  );

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
        personaData={personaData}
        loading={loading}
        onSelect={handleSelectPersona}
      />
    </Box>
  );
}
