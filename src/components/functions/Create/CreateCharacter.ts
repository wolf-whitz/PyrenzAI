import { supabase } from '~/Utility/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';

interface CreateCharacterResponse {
  char_uuid?: string;
  error?: string;
}

function cleanTags(tags?: string): string[] | undefined {
  if (!tags) return undefined;

  const tagsString = String(tags);
  const cleanedTags = tagsString.split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0);

  return cleanedTags;
}

export const createCharacter = async (
  Character: Character
): Promise<CreateCharacterResponse> => {
  try {
    if (!Character.creator || Character.creator.trim() === '')
      return { error: 'Creator is required.' };

    const characterUuid = uuidv4();
    if (!characterUuid) throw new Error('Failed to generate UUID.');

    const { char_uuid, tags, ...rest } = Character;
    const cleanedTags = cleanTags(tags);

    const insertData = { char_uuid: characterUuid, ...rest, tags: cleanedTags };
    const { data, error } = await supabase
      .from('characters')
      .insert([insertData]);

    if (error) {
      console.error('Error creating character:', error);
      Sentry.captureException(error);
      return { error: error.message };
    }
    return { char_uuid: characterUuid };
  } catch (error) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    return { error: 'An unexpected error occurred.' };
  }
};

export const updateCharacter = async (
  Character: Character
): Promise<CreateCharacterResponse> => {
  try {
    if (!Character.creator || Character.creator.trim() === '')
      return { error: 'Creator is required.' };

    const { char_uuid, tags, ...rest } = Character;
    if (!char_uuid)
      return { error: 'Character UUID is required for updating.' };

    const cleanedTags = cleanTags(tags);

    const updateData = {
      ...rest,
      tags: cleanedTags,
    };

    const { data, error } = await supabase.rpc('update_character', {
      char_uuid_param: char_uuid,
      character_data: updateData,
    });

    if (error) {
      console.error('Error updating character:', error);
      Sentry.captureException(error);
      return { error: error.message };
    }
    return { char_uuid };
  } catch (error) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    return { error: 'An unexpected error occurred.' };
  }
};
