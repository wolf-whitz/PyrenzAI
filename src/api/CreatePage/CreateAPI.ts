import {
  GetUserUUID,
  CreateNewChat,
  createCharacter,
  updateCharacter,
  handleClearCharacter,
  handleDeleteCharacter,
  handleSaveCharacter,
  handleSubmitCharacter,
} from '@components';
import { useState } from 'react';
import { useCharacterStore } from '~/store';
import * as Sentry from '@sentry/react';
import { Character, Draft } from '@shared-types';
import { usePyrenzAlert } from '~/provider';

export const useCreateAPI = (
  navigate: (path: string) => void,
  character_update: boolean,
  user_uuid: string | null,
  creator: string | null
) => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showRequiredFieldsPopup, setShowRequiredFieldsPopup] = useState(false);

  const Character = useCharacterStore((state) => state);
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const showAlert = usePyrenzAlert();

  const tags = Array.isArray(Character.tags)
    ? Character.tags
    : (Character.tags as string).split(',').map((tag: string) => tag.trim());

  const handleImageSelect = (file: File | null) => {
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCharacter({ profile_image: blobUrl });
    }
  };

  const character: Character = {
    persona: Character.persona,
    name: Character.name,
    model_instructions: Character.model_instructions,
    scenario: Character.scenario,
    description: Character.description,
    first_message: Character.first_message,
    tags: tags,
    gender: Character.gender,
    creator: creator || '',
    is_public: Character.is_public,
    is_nsfw: Character.is_nsfw,
    profile_image: Character.profile_image || '',
    creator_uuid: user_uuid || '',
    char_uuid: Character.char_uuid || '',
  };

  const handleClear = () => {
    handleClearCharacter(setCharacter);
    URL.revokeObjectURL(Character.profile_image ?? '');
  };

  const handleDelete = async () => {
    await handleDeleteCharacter(character, setCharacter, showAlert);
  };

  const handleSave = async () => {
    await handleSaveCharacter(character, user_uuid, setSaveLoading, showAlert);
  };

  const handleSelectDraft = (draft: Draft) => {
    setCharacter(draft);
  };

  const handleImportCharacter = (data: Character | null) => {
    if (!data) {
      console.error('No data provided to import character.');
      return;
    }

    setCharacter({ ...data });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    await handleSubmitCharacter(
      e,
      character,
      character_update,
      user_uuid,
      setLoading,
      showAlert,
      navigate,
      createCharacter,
      updateCharacter,
      CreateNewChat
    );
  };

  const formState = {
    ...character,
  };

  return {
    loading,
    saveLoading,
    showRequiredFieldsPopup,
    setShowRequiredFieldsPopup,
    Character,
    character,
    setCharacter,
    handleClear,
    handleSave,
    handleDelete,
    handleSelectDraft,
    handleImportCharacter,
    handleSubmit,
    formState,
    handleImageSelect,
  };
};
