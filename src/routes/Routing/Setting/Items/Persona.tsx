import { PyrenzBlueButton } from '~/theme';
import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { CreatePersonaModal, PersonaList, usePersonaAPI } from '@components';

interface Persona {
  id: string;
  persona_name: string;
  persona_description: string;
  persona_profile?: string | null;
}

export function Persona() {
  const {
    personaData,
    loading,
    userUuid,
    fetchUserUuid,
    fetchPersona,
    handleCreatePersona,
    handleSelectPersona,
    handleDeletePersona,
    handleEditPersona,
  } = usePersonaAPI();

  const [isModalOpen, setModalOpen] = useState(false);
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaDescription, setNewPersonaDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  useEffect(() => {
    fetchUserUuid();
  }, [fetchUserUuid]);

  useEffect(() => {
    if (userUuid) {
      fetchPersona();
    }
  }, [userUuid, fetchPersona]);

  const createPersona = useCallback(async () => {
    await handleCreatePersona(
      newPersonaName,
      newPersonaDescription,
      selectedImage || '',
      setNewPersonaName,
      setNewPersonaDescription,
      setSelectedImage,
      setModalOpen
    );
  }, [
    newPersonaName,
    newPersonaDescription,
    selectedImage,
    handleCreatePersona,
  ]);

  const editPersona = useCallback(async () => {
    if (!editingPersona) return;
    await handleEditPersona(
      editingPersona.id,
      newPersonaName,
      newPersonaDescription,
      selectedImage || '',
      setNewPersonaName,
      setNewPersonaDescription,
      setSelectedImage,
      setModalOpen,
      setEditingPersona
    );
  }, [
    editingPersona,
    newPersonaName,
    newPersonaDescription,
    selectedImage,
    handleEditPersona,
  ]);

  const handleDelete = useCallback(async () => {
    if (!editingPersona) return;
    await handleDeletePersona(editingPersona.id);
    setModalOpen(false);
    setEditingPersona(null);
  }, [editingPersona, handleDeletePersona]);

  if (!userUuid) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6" color="white" textAlign="center">
          Please log in to access your account settings.
        </Typography>
      </Box>
    );
  }

  const handleEdit = (id: string) => {
    const personaToEdit = personaData.find((persona) => persona.id === id);
    if (personaToEdit) {
      const mappedPersona: Persona = {
        id: personaToEdit.id,
        persona_name: personaToEdit.persona_name,
        persona_description: personaToEdit.persona_description,
        persona_profile: personaToEdit.persona_profile || undefined,
      };
      setEditingPersona(mappedPersona);
      setNewPersonaName(mappedPersona.persona_name);
      setNewPersonaDescription(mappedPersona.persona_description);
      setSelectedImage(mappedPersona.persona_profile || null);
      setModalOpen(true);
    }
  };

  const personaDataWithHandlers = personaData.map((persona) => ({
    ...persona,
    persona_profile: persona.persona_profile || undefined,
    onSelect: () => handleSelectPersona(persona.id),
    onDelete: () => handleDeletePersona(persona.id),
    onEdit: () => handleEdit(persona.id),
  }));

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6" color="white" textAlign="center">
        My Personas
      </Typography>

      <PersonaList personaData={personaDataWithHandlers} loading={loading} />

      <PyrenzBlueButton
        onClick={() => {
          setEditingPersona(null);
          setModalOpen(true);
        }}
        sx={{ mx: 'auto', mt: 2, px: 2, py: 1 }}
        size="small"
      >
        Create New Persona
      </PyrenzBlueButton>

      <CreatePersonaModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        newPersonaName={newPersonaName}
        setNewPersonaName={setNewPersonaName}
        newPersonaDescription={newPersonaDescription}
        setNewPersonaDescription={setNewPersonaDescription}
        handleCreatePersona={editingPersona ? editPersona : createPersona}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isEditing={!!editingPersona}
        onDelete={editingPersona ? handleDelete : undefined}
      />
    </Box>
  );
}
