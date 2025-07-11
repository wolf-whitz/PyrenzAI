import React, { useState, useEffect } from 'react';
import { PersonOutline as PersonOutlineIcon } from '@mui/icons-material';
import { Typography, Box, Button } from '@mui/material';
import { PersonaModal } from '@components';
import { supabase } from '@utils';

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
        <PersonOutlineIcon className="text-gray-400" />
        <Typography variant="h6" className="text-white">
          My Persona
        </Typography>
      </Box>

      <Button
        onClick={() => setModalOpen(true)}
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            transform: 'scale(1.05)',
          },
        }}
      >
        <Typography variant="body1">
          Name: {selectedPersona ? selectedPersona.persona_name : 'Anon'}
        </Typography>
      </Button>

      <Button
        onClick={() => setModalOpen(true)}
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '8px 12px',
          borderRadius: '4px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            transform: 'scale(1.05)',
          },
        }}
      >
        <Typography variant="body1">
          Description:{' '}
          {selectedPersona?.persona_description
            ? `${selectedPersona.persona_description.slice(0, 5)}...`
            : ''}
        </Typography>
      </Button>

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
