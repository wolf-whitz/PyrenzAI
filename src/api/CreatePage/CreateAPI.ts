import {
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
import { Character, Draft } from '@shared-types';
import { usePyrenzAlert } from '~/provider';

type CharacterState = {
  [K in keyof Character]?: Character[K] | null;
};

interface UseCreateAPIReturn {
  loading: boolean;
  saveLoading: boolean;
  showRequiredFieldsPopup: boolean;
  setShowRequiredFieldsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  characterState: CharacterState;
  character: Character;
  setCharacter: (character: Partial<Character>) => void;
  handleClear: () => void;
  handleSave: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleSelectDraft: (draft: Draft) => void;
  handleImportCharacter: (data: Character | null) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  formState: Character;
  handleImageSelect: (file: File | null) => void;
}

export const useCreateAPI = (
  navigate: (path: string) => void,
  character_update: boolean,
  user_uuid: string | null,
  creator: string | null
): UseCreateAPIReturn => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showRequiredFieldsPopup, setShowRequiredFieldsPopup] = useState(false);

  const characterState = useCharacterStore((state) => state);
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const showAlert = usePyrenzAlert();

  const tags = Array.isArray(characterState.tags)
    ? characterState.tags.join(', ')
    : characterState.tags || '';

  const handleImageSelect = (file: File | null) => {
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCharacter({ profile_image: blobUrl });
    }
  };

  const character: Character = {
    persona: characterState.persona || '',
    name: characterState.name || '',
    model_instructions: characterState.model_instructions || '',
    scenario: characterState.scenario || '',
    description: characterState.description || '',
    first_message: characterState.first_message || '',
    lorebook: characterState.lorebook || '',
    tags,
    gender: characterState.gender || '',
    creator: creator || '',
    is_public: characterState.is_public || false,
    is_nsfw: characterState.is_nsfw || false,
    is_details_private: characterState.is_details_private || false,
    profile_image: characterState.profile_image || '',
    creator_uuid: user_uuid || '',
    char_uuid: characterState.char_uuid || '',
  };

  const handleClear = () => {
    handleClearCharacter(setCharacter);
    if (characterState.profile_image) {
      URL.revokeObjectURL(characterState.profile_image);
    }
    showAlert('Character cleared successfully!', 'success');
  };

  const handleDelete = async () => {
    await handleDeleteCharacter(character, setCharacter, showAlert);
  };

  const handleSave = async () => {
    await handleSaveCharacter(character, user_uuid, setSaveLoading, showAlert);
  };

  const handleSelectDraft = (draft: Draft) => {
    setCharacter(draft);
    showAlert('Draft selected successfully!', 'success');
  };

  const handleImportCharacter = (data: Character | null) => {
    if (!data) {
      showAlert('No data provided to import character.', 'error');
      return;
    }
    setCharacter({ ...data });
    showAlert('Character imported successfully!', 'success');
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
    characterState,
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
