import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';
import { NotificationManager, Utils } from '~/Utility';

interface CreateCharacterResponse {
  char_uuid?: string;
  error?: string;
}

interface ApiResponse {
  error?: string;
}

const notifySuccess = async (
  message: string,
  userName?: string,
  charName?: string
) => {
  if (typeof document === 'undefined' || document.visibilityState === 'visible') return;
  await NotificationManager.fire({
    title: 'Character Saved',
    body: message,
    userName,
    charName,
    vibrateIfPossible: true,
  });
};

const postCharacter = async (
  type: 'create' | 'update',
  character: Character,
  profileImageFile: File | null
): Promise<ApiResponse> => {
  const data =
    profileImageFile
      ? (() => {
          const formData = new FormData();
          formData.append('type', type);
          formData.append('character', JSON.stringify(character));
          formData.append('profileImageFile', profileImageFile);
          return formData;
        })()
      : {
          type,
          character,
        };

  return await Utils.post('/api/CreateCharacter', data);
};

export const createCharacter = async (
  character: Character,
  profileImageFile: File | null = null
): Promise<CreateCharacterResponse> => {
  try {
    if (!character.creator?.trim()) {
      return { error: 'Creator is required.' };
    }

    const characterUuid = uuidv4();
    if (!characterUuid) throw new Error('Failed to generate UUID.');

    const updatedCharacter = { ...character, char_uuid: characterUuid };

    const res = await postCharacter('create', updatedCharacter, profileImageFile);
    if (res.error) return { error: res.error };

    await notifySuccess('Successfully created {{char}}.', character.creator, character.name);
    return { char_uuid: characterUuid };
  } catch (error) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    return { error: 'An unexpected error occurred.' };
  }
};

export const updateCharacter = async (
  character: Character,
  profileImageFile: File | null = null
): Promise<CreateCharacterResponse> => {
  try {
    if (!character.creator?.trim()) {
      return { error: 'Creator is required.' };
    }
    if (!character.char_uuid) {
      return { error: 'Character UUID is required for updating.' };
    }

    const res = await postCharacter('update', character, profileImageFile);
    if (res.error) return { error: res.error };

    await notifySuccess('Successfully updated {{char}}.', character.creator, character.name);
    return { char_uuid: character.char_uuid };
  } catch (error) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    return { error: 'An unexpected error occurred.' };
  }
};
