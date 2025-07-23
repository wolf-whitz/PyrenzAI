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

  const rawTags = characterState.tags as string[] | string | undefined;

  const tags = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === 'string'
      ? rawTags.split(',').map((tag: string) => tag.trim())
      : [];

  const handleImageSelect = (file: File | null) => {
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCharacter({ profile_image: blobUrl });
    }
  };

  const character: Character = {
    ...(characterState as Character),
    tags,
    creator: creator || '',
    creator_uuid: user_uuid || '',
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
    setCharacter({ ...draft, tags: tags });
    showAlert('Draft selected successfully!', 'success');
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
    handleSubmit,
    formState,
    handleImageSelect,
  };
};
