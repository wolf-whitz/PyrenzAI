import { supabase } from '~/Utility/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';

interface CreateCharacterResponse {
  char_uuid?: string;
  error?: string;
}

async function insertTags(char_uuid: string, user_uuid: string, tags: string[]) {
  if (!tags || tags.length === 0) return;

  for (const tag of tags) {
    const tagEntry = {
      char_uuid,
      user_uuid,
      tag_name: tag,
    };

    const { error } = await supabase
      .from('tags')
      .insert([tagEntry])
      .select();

    if (error) {
      console.error(`Error inserting tag "${tag}":`, error.message);
      Sentry.captureException(error);
    }
  }
}

export const createCharacter = async (
  character: Character
): Promise<CreateCharacterResponse> => {
  try {
    if (!character.creator || character.creator.trim() === '')
      return { error: 'Creator is required.' };

    const characterUuid = uuidv4();
    if (!characterUuid) throw new Error('Failed to generate UUID.');

    const { char_uuid, tags, creator_uuid: user_uuid, is_public, ...rest } = character;

    const insertData = {
      char_uuid: characterUuid,
      tags: tags || [],
      creator_uuid: user_uuid,
      is_public: is_public,
      ...rest
    };

    const tableName = is_public ? 'public_characters' : 'private_characters';

    const { error } = await supabase
      .from(tableName)
      .insert([insertData]);

    if (error) {
      console.error(`Error creating character in ${tableName}:`, error);
      Sentry.captureException(error);
      return { error: error.message };
    }

    if (tags && user_uuid) {
      await insertTags(characterUuid, user_uuid, tags);
    }

    return { char_uuid: characterUuid };
  } catch (error) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    return { error: 'An unexpected error occurred.' };
  }
};

export const updateCharacter = async (
  character: Character
): Promise<CreateCharacterResponse> => {
  try {
    if (!character.creator || character.creator.trim() === '')
      return { error: 'Creator is required.' };

    const { char_uuid, tags, creator_uuid: user_uuid, is_public, ...rest } = character;
    if (!char_uuid)
      return { error: 'Character UUID is required for updating.' };

    const updateData = {
      tags: tags,
      creator_uuid: user_uuid,
      is_public: is_public,
      ...rest
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

    if (user_uuid) {
      await supabase
        .from('tags')
        .delete()
        .eq('char_uuid', char_uuid);

      if (tags) {
        await insertTags(char_uuid, user_uuid, tags);
      }
    }

    return { char_uuid };
  } catch (error) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    return { error: 'An unexpected error occurred.' };
  }
};
