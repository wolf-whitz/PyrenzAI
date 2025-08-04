import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';
import { NotificationManager, Utils } from '~/Utility';

interface CreateCharacterResponse {
  char_uuid?: string;
  error?: string;
  is_moderated?: boolean;
  moderated_message?: string;
}

const notifySuccess = async (
  message: string,
  userName?: string,
  charName?: string
) => {
  if (typeof document === 'undefined' || document.visibilityState === 'visible')
    return;
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
  profileImageFile: File | null,
  emotionImageFile: File | null
): Promise<CreateCharacterResponse> => {
  const data =
    profileImageFile || emotionImageFile
      ? (() => {
          const formData = new FormData();
          formData.append('type', type);
          formData.append('character', JSON.stringify({ ...character }));
          if (profileImageFile)
            formData.append('profileImageFile', profileImageFile);
          if (emotionImageFile)
            formData.append('emotionImageFile', emotionImageFile);
          return formData;
        })()
      : { type, character: { ...character } };

  const res = await Utils.post<CreateCharacterResponse>(
    '/api/CreateCharacter',
    data
  );

  if (res.error) throw new Error(res.error);

  if (res.is_moderated) {
    const msg =
      res.moderated_message ||
      '⚠️ Your character triggered moderation filters. Please revise and try again.';
    throw new Error(msg);
  }

  return res;
};

const handleCharacterPost = async (
  type: 'create' | 'update',
  character: Character,
  profileImageFile: File | null,
  emotionImageFile: File | null,
  successMsg: string
): Promise<CreateCharacterResponse> => {
  character.emotions ??= [];

  if (!character.creator?.trim()) {
    return { error: 'Creator is required.' };
  }

  if (type === 'create' && !character.char_uuid) {
    try {
      character.char_uuid = crypto.randomUUID();
    } catch (err) {
      Sentry.captureException(err);
      return { error: 'Failed to generate character ID.' };
    }
  }

  if (type === 'update' && !character.char_uuid) {
    return { error: 'Character UUID is required for updating.' };
  }

  try {
    await postCharacter(type, character, profileImageFile, emotionImageFile);
    await notifySuccess(successMsg, character.creator, character.name);
    return { char_uuid: character.char_uuid };
  } catch (err: any) {
    return { error: err.message || 'Something went wrong.' };
  }
};

export const createCharacter = (
  character: Character,
  profileImageFile: File | null = null,
  emotionImageFile: File | null = null
): Promise<CreateCharacterResponse> => {
  return handleCharacterPost(
    'create',
    character,
    profileImageFile,
    emotionImageFile,
    'Successfully created {{char}}.'
  );
};

export const updateCharacter = (
  character: Character,
  profileImageFile: File | null = null,
  emotionImageFile: File | null = null
): Promise<CreateCharacterResponse> => {
  return handleCharacterPost(
    'update',
    character,
    profileImageFile,
    emotionImageFile,
    'Successfully updated {{char}}.'
  );
};
