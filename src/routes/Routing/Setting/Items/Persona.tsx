import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { useUserStore } from '~/store/index';
import {
  CreatePersonaModal,
  PersonaList,
  CreateCharacterCardImageModal,
  CharacterCardImageModal,
} from '@components/index';

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
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaDescription, setNewPersonaDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [
    isCreateCharacterCardImageModalOpen,
    setCreateCharacterCardImageModalOpen,
  ] = useState(false);
  const [isCharacterCardImageModalOpen, setCharacterCardImageModalOpen] =
    useState(false);
  const [selectedImage, setSelectedImage] = useState('');
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

      const mappedData = data.map((item) => ({
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

  const checkAdminStatus = async () => {
    if (!user_uuid) return;

    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('is_admin')
        .eq('user_uuid', user_uuid)
        .single();

      if (error) {
        throw error;
      }

      setIsAdmin(data.is_admin);
    } catch (error) {
      console.error('Failed to check admin status', error);
    }
  };

  useEffect(() => {
    fetchPersona();
    checkAdminStatus();
  }, [user_uuid]);

  const handleCreatePersona = async () => {
    if (!newPersonaName || !newPersonaDescription || !user_uuid) return;

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .insert([
          {
            persona_name: newPersonaName,
            persona_description: newPersonaDescription,
            user_uuid,
            persona_image: selectedImage,
          },
        ])
        .select<
          any,
          {
            persona_profile: string;
            persona_name: string;
            persona_description: string;
          }
        >();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newPersona: PersonaCard = {
          id:
            data[0].persona_profile || Math.random().toString(36).substr(2, 9),
          name: data[0].persona_name,
          description: data[0].persona_description,
        };

        setPersonaData((prevData) => [...prevData, newPersona]);
        setNewPersonaName('');
        setNewPersonaDescription('');
        setSelectedImage('');
        setModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to create persona', error);
    } finally {
      setCreating(false);
    }
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

      <PersonaList personaData={personaData} loading={loading} />

      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
        className="mx-auto mt-4 px-3 py-1 text-sm normal-case"
        size="small"
      >
        Create New Persona
      </Button>

      {isAdmin && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateCharacterCardImageModalOpen(true)}
          className="mx-auto mt-4 px-3 py-1 text-sm normal-case"
          size="small"
        >
          Create Image Cards
        </Button>
      )}

      {isAdmin && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCharacterCardImageModalOpen(true)}
          className="mx-auto mt-4 px-3 py-1 text-sm normal-case"
          size="small"
        >
          View Image Cards
        </Button>
      )}

      <CreatePersonaModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        newPersonaName={newPersonaName}
        setNewPersonaName={setNewPersonaName}
        newPersonaDescription={newPersonaDescription}
        setNewPersonaDescription={setNewPersonaDescription}
        handleCreatePersona={handleCreatePersona}
        creating={creating}
        setCharacterCardImageModalOpen={setCharacterCardImageModalOpen}
        selectedImage={selectedImage}
      />

      {isCreateCharacterCardImageModalOpen && (
        <CreateCharacterCardImageModal
          isModalOpen={isCreateCharacterCardImageModalOpen}
          setModalOpen={setCreateCharacterCardImageModalOpen}
        />
      )}

      {isCharacterCardImageModalOpen && (
        <CharacterCardImageModal
          isModalOpen={isCharacterCardImageModalOpen}
          setModalOpen={setCharacterCardImageModalOpen}
          setCreatePersonaModalOpen={setModalOpen}
          setSelectedImage={setSelectedImage}
        />
      )}
    </div>
  );
}
