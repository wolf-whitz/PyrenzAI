import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { useUserStore } from '~/store/index';
import { CreatePersonaModal } from '@components/index';

interface PersonaCard {
    id: string;
    name: string;
    description: string;
    selected?: boolean;
}

export default function Persona() {
  const [personaData, setPersonaData] = useState<PersonaCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaCard | null>(null);
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaDescription, setNewPersonaDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const { user_uuid } = useUserStore();

  const fetchPersona = async () => {
    if (!user_uuid) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('persona_name, persona_description, persona_profile, selected')
        .eq('user_uuid', user_uuid);

      if (error) {
        throw error;
      }

      const mappedData = data.map(item => ({
        id: item.persona_profile || Math.random().toString(36).substr(2, 9),
        name: item.persona_name,
        description: item.persona_description,
        selected: item.selected,
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
  }, [user_uuid]);

  const handleCreatePersona = async () => {
    if (!newPersonaName || !newPersonaDescription || !user_uuid) return;

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .insert([{ persona_name: newPersonaName, persona_description: newPersonaDescription, user_uuid }])
        .select<any, { persona_profile: string; persona_name: string; persona_description: string; }>();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newPersona: PersonaCard = {
          id: data[0].persona_profile || Math.random().toString(36).substr(2, 9), // Ensure a unique ID
          name: data[0].persona_name,
          description: data[0].persona_description,
        };

        setPersonaData((prevData) => [...prevData, newPersona]);
        setNewPersonaName('');
        setNewPersonaDescription('');
        setModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to create persona', error);
    } finally {
      setCreating(false);
    }
  };

  const truncateDescription = (description: string, limit: number = 100) => {
    return description.length > limit
      ? `${description.slice(0, limit)}...`
      : description;
  };

  if (!user_uuid) {
    return (
      <div className="flex flex-col gap-4">
        <Typography variant="h6" className="text-white text-center">
          Please log in to access your account settings.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h6" className="text-white text-center">
        My Personas
      </Typography>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <CircularProgress />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {personaData.length > 0 ? (
            personaData.map((persona) => (
                <div
                key={persona.id}
                className={`bg-gray-700 rounded-lg p-4 flex flex-col cursor-pointer border-2 ${
                  persona.selected ? 'border-blue-500' : 'border-transparent'
                }`}
              >

                <Typography variant="h6" className="text-white">
                  {persona.name}
                </Typography>
                <Typography variant="body2" className="text-gray-300">
                  {truncateDescription(persona.description)}
                </Typography>
                {persona.selected && (
                  <Typography variant="body2" className="text-gray-400 mt-2">
                    Default Persona
                  </Typography>
                )}
              </div>
            ))
          ) : (
            <Typography variant="body1" className="text-center text-white">
              No persona data available. Perhaps create a few?
            </Typography>
          )}
        </div>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
        className="mx-auto mt-4 px-3 py-1 text-sm normal-case"
        size="small"
      >
        Create New Persona
      </Button>

      <CreatePersonaModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        newPersonaName={newPersonaName}
        setNewPersonaName={setNewPersonaName}
        newPersonaDescription={newPersonaDescription}
        setNewPersonaDescription={setNewPersonaDescription}
        handleCreatePersona={handleCreatePersona}
        creating={creating}
      />
    </div>
  );
}
