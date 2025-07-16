import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';
import { NotificationManager, Utils } from '~/Utility';

interface CreateCharacterResponse {
  char_uuid?: string;
  error?: string;
  is_moderated?: boolean;
  moderated_message?: string;
}

interface ApiResponse {
  error?: string;
  is_moderated?: boolean;
  moderated_message?: string;
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
  const data = profileImageFile
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

  try {
    return await Utils.post('/api/CreateCharacter', data);
  } catch (err) {
    Sentry.captureException(err);
    return { error: 'Failed to reach the server.' };
  }
};

export const createCharacter = async (
  character: Character,
  profileImageFile: File | null = null
): Promise<CreateCharacterResponse> => {
  if (!character.creator?.trim()) {
    return { error: 'Creator is required.' };
  }

  let characterUuid;
  try {
    characterUuid = uuidv4();
  } catch (err) {
    Sentry.captureException(err);
    return { error: 'Failed to generate character ID.' };
  }

  const updatedCharacter = { ...character, char_uuid: characterUuid };
  const res = await postCharacter('create', updatedCharacter, profileImageFile);

  if (res.is_moderated) {
    return {
      is_moderated: true,
      moderated_message:
        res.moderated_message ||
        '⚠️ Your character triggered moderation filters. Please revise and try again.',
    };
  }

  if (res.error) {
    return { error: res.error };
  }

  await notifySuccess('Successfully created {{char}}.', character.creator, character.name);
  return { char_uuid: characterUuid };
};

export const updateCharacter = async (
  character: Character,
  profileImageFile: File | null = null
): Promise<CreateCharacterResponse> => {
  if (!character.creator?.trim()) {
    return { error: 'Creator is required.' };
  }

  if (!character.char_uuid) {
    return { error: 'Character UUID is required for updating.' };
  }

  const res = await postCharacter('update', character, profileImageFile);

  if (res.is_moderated) {
    return {
      is_moderated: true,
      moderated_message:
        res.moderated_message ||
        '⚠️ Your character triggered moderation filters. Please revise and try again.',
    };
  }

  if (res.error) {
    return { error: res.error };
  }

  await notifySuccess('Successfully updated {{char}}.', character.creator, character.name);
  return { char_uuid: character.char_uuid };
};
