import { PyrenzBlueButton } from '~/theme';
import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import {
  CreatePersonaModal,
  CreateCharacterCardImageModal,
  CharacterCardImageModal,
  PersonaList,
} from '@components';
import { usePersonaAPI } from '@api';

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
    isAdmin,
    creating,
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
  const [
    isCreateCharacterCardImageModalOpen,
    setCreateCharacterCardImageModalOpen,
  ] = useState(false);
  const [isCharacterCardImageModalOpen, setCharacterCardImageModalOpen] =
    useState(false);
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
      <div className="flex flex-col gap-4">
        <Typography variant="h6" className="text-white text-center">
          Please log in to access your account settings.
        </Typography>
      </div>
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
    <div className="flex flex-col gap-4">
      <Typography variant="h6" className="text-white text-center">
        My Personas
      </Typography>

      <PersonaList personaData={personaDataWithHandlers} loading={loading} />

      <PyrenzBlueButton
        onClick={() => {
          setEditingPersona(null);
          setModalOpen(true);
        }}
        className="mx-auto mt-4 px-3 py-1 text-sm normal-case"
        size="small"
      >
        Create New Persona
      </PyrenzBlueButton>

      {isAdmin && (
        <PyrenzBlueButton
          onClick={() => setCreateCharacterCardImageModalOpen(true)}
          className="mx-auto mt-4 px-3 py-1 text-sm normal-case"
          size="small"
        >
          Create Image Cards
        </PyrenzBlueButton>
      )}

      {isAdmin && (
        <PyrenzBlueButton
          onClick={() => setCharacterCardImageModalOpen(true)}
          className="mx-auto mt-4 px-3 py-1 text-sm normal-case"
          size="small"
        >
          View Image Cards
        </PyrenzBlueButton>
      )}

      <CreatePersonaModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        newPersonaName={newPersonaName}
        setNewPersonaName={setNewPersonaName}
        newPersonaDescription={newPersonaDescription}
        setNewPersonaDescription={setNewPersonaDescription}
        handleCreatePersona={editingPersona ? editPersona : createPersona}
        creating={creating}
        setCharacterCardImageModalOpen={setCharacterCardImageModalOpen}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isEditing={!!editingPersona}
        onDelete={editingPersona ? handleDelete : undefined}
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
