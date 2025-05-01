import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Button, CircularProgress, TextField } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient'; // Import the Supabase client

interface PersonaCard {
  id: string;
  name: string;
  description: string;
}

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  personaData: PersonaCard[];
  loading: boolean;
  onSelect: (persona: PersonaCard) => void;
  onCreate: (newPersona: PersonaCard) => void; // Add onCreate prop
}

interface SupabasePersona {
  persona_profile: string;
  persona_name: string;
  persona_description: string;
}

export default function PersonaModal({
  isOpen,
  onClose,
  personaData,
  loading,
  onSelect,
  onCreate,
}: PersonaModalProps) {
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaDescription, setNewPersonaDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const truncateDescription = (description: string, limit: number = 100) => {
    return description.length > limit
      ? `${description.slice(0, limit)}...`
      : description;
  };

  const handleCreatePersona = async () => {
    if (!newPersonaName || !newPersonaDescription) return;

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from<SupabasePersona>('personas')
        .insert([{ persona_name: newPersonaName, persona_description: newPersonaDescription }])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newPersona: PersonaCard = {
          id: data[0].persona_profile,
          name: data[0].persona_name,
          description: data[0].persona_description,
        };

        onCreate(newPersona);
        setNewPersonaName('');
        setNewPersonaDescription('');
      }
    } catch (error) {
      console.error('Failed to create persona', error);
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      onClick={onClose}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-lg p-5 w-96"
        initial={{ y: '-100vh', scale: 0.8 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: '100vh', scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" className="text-white">
            Personas
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box mt={4} className="space-y-4">
            {personaData.length > 0 ? (
              personaData.map((persona) => (
                <Box
                  key={persona.id}
                  className="bg-gray-700 rounded-lg p-4"
                  display="flex"
                  flexDirection="column"
                >
                  <Typography variant="h6" className="text-white">
                    {persona.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-300">
                    {truncateDescription(persona.description)}
                  </Typography>
                  <Button
                    onClick={() => onSelect(persona)}
                    variant="contained"
                    color="primary"
                    className="mt-3"
                  >
                    Select
                  </Button>
                </Box>
              ))
            ) : (
              <Typography variant="body1" className="text-center text-white">
                No persona data available.
              </Typography>
            )}

            <Box className="bg-gray-700 rounded-lg p-4" display="flex" flexDirection="column">
              <Typography variant="h6" className="text-white">
                Create New Persona
              </Typography>
              <TextField
                label="Name"
                variant="outlined"
                value={newPersonaName}
                onChange={(e) => setNewPersonaName(e.target.value)}
                className="mt-2"
                fullWidth
              />
              <TextField
                label="Description"
                variant="outlined"
                value={newPersonaDescription}
                onChange={(e) => setNewPersonaDescription(e.target.value)}
                className="mt-2"
                fullWidth
                multiline
                rows={3}
              />
              <Button
                onClick={handleCreatePersona}
                variant="contained"
                color="primary"
                className="mt-3"
                disabled={creating}
              >
                {creating ? <CircularProgress size={24} /> : 'Create'}
              </Button>
            </Box>
          </Box>
        )}
      </motion.div>
    </motion.div>,
    document.getElementById('modal-root')!
  );
}
