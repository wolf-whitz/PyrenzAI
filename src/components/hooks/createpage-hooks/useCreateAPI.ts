import {
  handleDeleteCharacter,
  handleSubmitCharacter,
  CreateNewChat,
} from '@components';
import { useState, useMemo, useCallback } from 'react';
import { useCharacterStore } from '~/store';
import { CharacterPayload, CharacterPayloadSchema } from '@shared-types';
import { usePyrenzAlert } from '~/provider';
import * as Sentry from '@sentry/react';
import { z } from 'zod';

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
  setCharacter: (
    character: Partial<CharacterPayload & ReturnType<typeof useCharacterStore>>
  ) => void;
  handleDelete: () => Promise<void>;
  handleSubmit: (type: ActionType, e?: React.FormEvent) => Promise<void>;
  formState: CharacterPayload;
  handleImageSelect: (file: File | null) => void;
  handleSelectDraft: (draft: CharacterPayload) => void;
  handleClear: () => void;
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

  const tags = useMemo(() => {
    const rawTags = characterStateWithoutError.tags as
      | string[]
      | string
      | undefined;
    return Array.isArray(rawTags)
      ? rawTags
      : typeof rawTags === 'string'
        ? rawTags.split(',').map((tag) => tag.trim())
        : [];
  }, [characterStateWithoutError.tags]);

  const handleImageSelect = useCallback(
    (file: File | null) => {
      if (file) {
        const blobUrl = URL.createObjectURL(file);
        setCharacter({ profile_image: blobUrl });
      }
    },
    [setCharacter]
  );

  const emotionsNormalized = useMemo(
    () =>
      Array.isArray(characterStateWithoutError.emotions)
        ? characterStateWithoutError.emotions
        : [],
    [characterStateWithoutError.emotions]
  );

  const character: CharacterPayload = useMemo(
    () => ({
      ...(characterStateWithoutError as CharacterPayload),
      tags,
      creator: creator || '',
      creator_uuid: user_uuid || '',
      emotions: emotionsNormalized,
    }),
    [characterStateWithoutError, tags, creator, user_uuid, emotionsNormalized]
  );

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await handleDeleteCharacter(character, setCharacter, showAlert);
    } finally {
      setLoading(false);
    }
  }, [character, setCharacter, showAlert]);

  const handleSubmit = useCallback(
    async (type: ActionType, e?: React.FormEvent) => {
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
    },
    [character, user_uuid, showAlert, navigate]
  );

  const handleSelectDraft = useCallback(
    (draft: CharacterPayload) => {
      setCharacter(draft);
      showAlert('Draft loaded successfully!', 'success');
    },
    [setCharacter, showAlert]
  );

  const getEmptyValue = (schema: z.ZodTypeAny): any => {
    if (schema.isOptional()) return '';
    if (schema instanceof z.ZodDefault) {
      return schema._def.defaultValue();
    }
    if (schema instanceof z.ZodString) return '';
    if (schema instanceof z.ZodNumber) return 0;
    if (schema instanceof z.ZodBoolean) return false;
    if (schema instanceof z.ZodArray) return [];
    if (schema instanceof z.ZodNullable) return '';
    return '';
  };

  const handleClear = () => {
    const shape = CharacterPayloadSchema.shape;

    const emptyCharacter = Object.keys(shape).reduce((acc, key) => {
      (acc as any)[key] = getEmptyValue((shape as any)[key]);
      return acc;
    }, {} as any);

    setCharacter({
      ...emptyCharacter,
      tokenTotal: 0,
      permanentTokens: 0,
      temporaryTokens: 0,
      first_message: [],
      error: null,
    });

    showAlert('Form cleared!', 'success');
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
    handleDelete,
    handleSubmit,
    formState,
    handleImageSelect,
    handleSelectDraft,
    handleClear,
  };
};
