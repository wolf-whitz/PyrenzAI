import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';
import { NotificationManager, supabase } from '@utils';

interface CreateCharacterResponse {
  char_uuid?: string;
  error?: string;
}

async function insertTags(
  char_uuid: string,
  user_uuid: string,
  tags: string[]
): Promise<void> {
  if (!tags || tags.length === 0) return;

  for (const tag of tags) {
    const tagEntry = {
      char_uuid,
      user_uuid,
      tag_name: tag,
    };

    const { error } = await supabase.from('tags').insert([tagEntry]).select();

    if (error) {
      console.error(`Error inserting tag "${tag}":`, error.message);
      Sentry.captureException(error);
    }
  }
}

async function uploadImage(
  file: File,
  char_uuid: string
): Promise<string | null> {
  try {
    const fileName = `character-image/${char_uuid}-${file.name}`;
    const { error } = await supabase.storage
      .from('character-image')
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error('Error uploading image:', error);
      Sentry.captureException(error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('character-image')
      .getPublicUrl(fileName);

    return publicUrlData?.publicUrl || null;
  } catch (error) {
    console.error('Error uploading image:', error);
    Sentry.captureException(error);
    return null;
  }
}

const notifySuccess = async (
  message: string,
  userName?: string,
  charName?: string
) => {
  if (typeof document === 'undefined') return;
  if (document.visibilityState === 'visible') return;
  await NotificationManager.fire({
    title: 'Character Saved',
    body: message,
    userName,
    charName,
    vibrateIfPossible: true,
  });
};

export const createCharacter = async (
  character: Character,
  profileImageFile: File | null = null
): Promise<CreateCharacterResponse> => {
  try {
    if (!character.creator || character.creator.trim() === '')
      return { error: 'Creator is required.' };

    const characterUuid = uuidv4();
    if (!characterUuid) throw new Error('Failed to generate UUID.');

    let profileImageUrl = character.profile_image;

    if (profileImageFile) {
      const uploadedUrl = await uploadImage(profileImageFile, characterUuid);
      profileImageUrl = uploadedUrl || '';
    }

    const {
      char_uuid,
      tags,
      creator_uuid: user_uuid,
      is_public,
      profile_image,
      ...rest
    } = character;

    const insertData = {
      char_uuid: characterUuid,
      tags: tags || [],
      creator_uuid: user_uuid,
      is_public,
      profile_image: profileImageUrl,
      ...rest,
    };

    const tableName = is_public ? 'public_characters' : 'private_characters';

    const { error } = await supabase.from(tableName).insert([insertData]);

    if (error) {
      console.error(`Error creating character in ${tableName}:`, error);
      Sentry.captureException(error);
      return { error: error.message };
    }

    if (tags && user_uuid) {
      await insertTags(characterUuid, user_uuid, tags);
    }

    await notifySuccess(
      'Successfully created {{char}}.',
      character.creator,
      character.name
    );

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
    if (!character.creator || character.creator.trim() === '')
      return { error: 'Creator is required.' };

    const {
      char_uuid,
      tags,
      creator_uuid: user_uuid,
      is_public,
      profile_image,
      ...rest
    } = character;

    if (!char_uuid)
      return { error: 'Character UUID is required for updating.' };

    let profileImageUrl = character.profile_image;

    if (profileImageFile) {
      const uploadedUrl = await uploadImage(profileImageFile, char_uuid);
      profileImageUrl = uploadedUrl || '';
    }

    const updateData = {
      creator_uuid: user_uuid,
      is_public,
      profile_image: profileImageUrl,
      ...rest,
    };

    const { error } = await supabase.rpc('update_character', {
      char_uuid_param: char_uuid,
      character_data: updateData,
    });

    if (error) {
      console.error(`Error updating character:`, error);
      Sentry.captureException(error);
      return { error: error.message };
    }

    await notifySuccess(
      'Successfully updated {{char}}.',
      character.creator,
      character.name
    );

    return { char_uuid };
  } catch (error) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    return { error: 'An unexpected error occurred.' };
  }
};
