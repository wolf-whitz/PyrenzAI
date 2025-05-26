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

export function Persona() {
  const {
    personaData,
    loading,
    isAdmin,
    creating,
    userUuid,
    fetchUserUuid,
    fetchPersona,
    checkAdminStatus,
    handleCreatePersona,
  } = usePersonaAPI();

  const [isModalOpen, setModalOpen] = useState(false);
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaDescription, setNewPersonaDescription] = useState('');
  const [isCreateCharacterCardImageModalOpen, setCreateCharacterCardImageModalOpen] = useState(false);
  const [isCharacterCardImageModalOpen, setCharacterCardImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetchUserUuid();
  }, [fetchUserUuid]);

  useEffect(() => {
    if (userUuid) {
      fetchPersona();
      checkAdminStatus();
    }
  }, [userUuid, fetchPersona, checkAdminStatus]);

  const createPersona = useCallback(async () => {
    await handleCreatePersona(
      newPersonaName,
      newPersonaDescription,
      selectedImage,
      setNewPersonaName,
      setNewPersonaDescription,
      setSelectedImage,
      setModalOpen
    );
  }, [newPersonaName, newPersonaDescription, selectedImage, handleCreatePersona]);

  if (!userUuid) {
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

      <PyrenzBlueButton
        onClick={() => setModalOpen(true)}
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
        handleCreatePersona={createPersona}
        creating={creating}
        setCharacterCardImageModalOpen={setCharacterCardImageModalOpen}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
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
