import {
  handleClearCharacter,
  handleDeleteCharacter,
  handleSubmitCharacter,
  CreateNewChat
} from '@components';

import { useState } from 'react';
import { useCharacterStore } from '~/store';
import { CharacterPayload } from '@shared-types';
import { usePyrenzAlert } from '~/provider';
import * as Sentry from '@sentry/react';

type ActionType = 'Create' | 'Update' | 'Draft';

type CharacterState = {
  [K in keyof CharacterPayload]?: CharacterPayload[K] | null;
};

interface UseCreateAPIReturn {
  loading: boolean;
  saveLoading: boolean;
  showRequiredFieldsPopup: boolean;
  setShowRequiredFieldsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  characterState: CharacterState;
  character: CharacterPayload;
  setCharacter: (character: Partial<CharacterPayload>) => void;
  handleClear: () => void;
  handleDelete: () => Promise<void>;
  handleSubmit: (type: ActionType, e?: React.FormEvent) => Promise<void>;
  formState: CharacterPayload;
  handleImageSelect: (file: File | null) => void;
  handleSelectDraft: (draft: CharacterPayload) => void;
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
  const { error, setError, ...characterStateWithoutError } = useCharacterStore(
    (state) => state
  );
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const showAlert = usePyrenzAlert();

  const rawTags = characterStateWithoutError.tags as
    | string[]
    | string
    | undefined;
  const tags = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === 'string'
    ? rawTags.split(',').map((tag) => tag.trim())
    : [];

  const handleImageSelect = (file: File | null) => {
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCharacter({ profile_image: blobUrl });
    }
  };

  const emotionsNormalized =
    Array.isArray(characterStateWithoutError.emotions)
      ? characterStateWithoutError.emotions
      : [];

  const character: CharacterPayload = {
    ...(characterStateWithoutError as CharacterPayload),
    tags,
    creator: creator || '',
    creator_uuid: user_uuid || '',
    emotions: emotionsNormalized,
  };

  const handleClear = () => {
    handleClearCharacter(setCharacter);
    if (characterStateWithoutError.profile_image) {
      URL.revokeObjectURL(characterStateWithoutError.profile_image);
    }
    setError(null);
    showAlert('Character cleared successfully!', 'success');
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await handleDeleteCharacter(character, setCharacter, showAlert);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (type: ActionType, e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      await handleSubmitCharacter(
        character,
        type,
        user_uuid || '',
        showAlert,
        navigate,
        CreateNewChat
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDraft = (draft: CharacterPayload) => {
    setCharacter(draft);
    showAlert('Draft loaded successfully!', 'success');
  };

  const formState = { ...character };

  return {
    loading,
    saveLoading,
    showRequiredFieldsPopup,
    setShowRequiredFieldsPopup,
    characterState: characterStateWithoutError,
    character,
    setCharacter,
    handleClear,
    handleDelete,
    handleSubmit,
    formState,
    handleImageSelect,
    handleSelectDraft,
  };
};
