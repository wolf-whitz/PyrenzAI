import * as Sentry from '@sentry/react';
import { CharacterPayload, CharacterPayloadSchema } from '@shared-types';
import { NotificationManager, Utils as utils } from '~/utility';

interface CreateCharacterResponse {
  char_uuid?: string;
  error?: string;
  is_moderated?: boolean;
  moderated_message?: string;
  issues?: string[];
}

const requiredCharacterFields: (keyof CharacterPayload)[] = [
  'title',
  'persona',
  'name',
  'model_instructions',
  'scenario',
  'description',
  'first_message',
  'tags',
  'gender',
  'creator',
  'attribute',
];

const validateCharacterData = (character: CharacterPayload) => {
  const filteredCharacter = { ...character };
  delete filteredCharacter.emotionImageFile;
  delete filteredCharacter.profileImageFile;
  delete filteredCharacter.is_banned;
  delete filteredCharacter.is_owner;

  const missingFields = requiredCharacterFields.filter((field) => {
    const value = filteredCharacter[field];
    return (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    );
  });

  if (missingFields.length > 0) {
    return {
      error: `Missing or undefined fields: ${missingFields.join(', ')}`,
    };
  }

  try {
    const parsed = CharacterPayloadSchema.parse(filteredCharacter);
    parsed.emotions ??= [];
    if (!parsed.creator?.trim()) {
      return { error: 'Creator is required.' };
    }
    return { parsed };
  } catch (err: any) {
    return { error: err.message || 'Invalid character format.' };
  }
};

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
  filteredCharacter: CharacterPayload
): Promise<CreateCharacterResponse> => {
  const data = { type, character: filteredCharacter };

  const res = await utils.post<CreateCharacterResponse>('/api/CreateCharacter', data);
  if (res.error) throw new Error(res.error);
  if (res.is_moderated) {
    throw new Error(
      res.moderated_message ||
        '⚠️ Your character triggered moderation filters. Please revise and try again.'
    );
  }
  if (res.issues && res.issues.length > 0) {
    throw new Error(
      `Character moderation issues: ${res.issues.join('; ')}`
    );
  }
  return res;
};

const handleCharacterPost = async (
  type: 'create' | 'update',
  character: CharacterPayload,
  successMsg: string
): Promise<CreateCharacterResponse> => {
  const { parsed, error } = validateCharacterData(character);
  if (error) return { error };

  if (type === 'create' && !parsed!.char_uuid) {
    try {
      parsed!.char_uuid = crypto.randomUUID();
    } catch (err) {
      Sentry.captureException(err);
      return { error: 'Failed to generate character ID.' };
    }
  }

  if (type === 'update' && !parsed!.char_uuid) {
    return { error: 'Character UUID is required for updating.' };
  }

  try {
    await postCharacter(type, parsed!);
    await notifySuccess(successMsg, parsed!.creator, parsed!.name);
    return { char_uuid: parsed!.char_uuid };
  } catch (err: any) {
    return { error: err.message || 'Something went wrong.' };
  }
};

export const createCharacter = (
  character: CharacterPayload
): Promise<CreateCharacterResponse> => {
  return handleCharacterPost(
    'create',
    character,
    'Successfully created {{char}}.'
  );
};

export const updateCharacter = (
  character: CharacterPayload
): Promise<CreateCharacterResponse> => {
  return handleCharacterPost(
    'update',
    character,
    'Successfully updated {{char}}.'
  );
};

export const createDraft = async (
  character: CharacterPayload,
  creatorUuid: string
): Promise<{ error?: string }> => {
  const { parsed, error } = validateCharacterData(character);
  if (error) return { error };

  try {
    await utils.db.insert({
      tables: 'draft_characters',
      data: {
        ...parsed!,
        creator_uuid: creatorUuid,
      },
    });
    return {};
  } catch (err: any) {
    Sentry.captureException(err);
    return { error: err.message || 'Failed to create draft.' };
  }
};
