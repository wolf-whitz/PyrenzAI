import { supabase } from '~/Utility/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';

interface CreateCharacterResponse {
  char_uuid?: string;
  error?: string;
}

function cleanTags(tags?: string): string | undefined {
  if (!tags) return undefined;

  const tagsString = String(tags);
  const cleanedTags = tagsString.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  return JSON.stringify(cleanedTags);
}

async function insertTags(char_uuid: string, user_uuid: string, tags: string[]) {
  if (!tags || tags.length === 0) return;

  const tagEntries = tags.map(tag => ({
    char_uuid,
    user_uuid,
    tag_name: tag,
  }));

  const { error } = await supabase
    .from('tags')
    .insert(tagEntries);

  if (error) {
    console.error('Error inserting tags:', error);
    Sentry.captureException(error);
    throw new Error(error.message);
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

    const { char_uuid, tags, creator_uuid: user_uuid, ...rest } = character;
    const cleanedTags = cleanTags(tags);

    const insertData = {
      char_uuid: characterUuid,
      tags: cleanedTags,
      creator_uuid: user_uuid,
      ...rest
    };

    const { error } = await supabase
      .from('characters')
      .insert([insertData]);

    if (error) {
      console.error('Error creating character:', error);
      Sentry.captureException(error);
      return { error: error.message };
    }

    if (cleanedTags && user_uuid) {
      await insertTags(characterUuid, user_uuid, JSON.parse(cleanedTags));
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

    const { char_uuid, tags, creator_uuid: user_uuid, ...rest } = character;
    if (!char_uuid)
      return { error: 'Character UUID is required for updating.' };

    const cleanedTags = cleanTags(tags);

    const updateData = {
      ...rest,
      tags: cleanedTags,
      creator_uuid: user_uuid,
      char_uuid: char_uuid,
    };

    const { error } = await supabase.rpc('update_character', {
      char_uuid_param: char_uuid,
      character_data: updateData,
    });

    if (error) {
      console.error('Error updating character:', error);
      Sentry.captureException(error);
      return { error: error.message };
    }

    if (cleanedTags && user_uuid) {
      await supabase
        .from('tags')
        .delete()
        .eq('char_uuid', char_uuid);

      await insertTags(char_uuid, user_uuid, JSON.parse(cleanedTags));
    }

    return { char_uuid };
  } catch (error) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    return { error: 'An unexpected error occurred.' };
  }
};
