import { supabase } from '~/Utility/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react';
import { CharacterData } from '@shared-types/CharacterProp';

interface CreateCharacterResponse {
  char_uuid?: string;
  error?: string;
}

function cleanTags(tags?: string | string[]): string | undefined {
  if (!tags) return undefined;

  let tagsArray: string[] = [];

  if (typeof tags === 'string') {
    tagsArray = tags.split(',');
  } else if (Array.isArray(tags)) {
    if (tags.length === 1 && tags[0].includes(',')) {
      tagsArray = tags[0].split(',');
    } else {
      tagsArray = tags;
    }
  }

  const cleanedTags = tagsArray
    .map((tag: string) => tag.trim().toLowerCase())
    .filter((tag: string) => tag.length > 0);

  return cleanedTags.length > 0 ? JSON.stringify(cleanedTags) : undefined;
}

export const createCharacter = async (
  characterData: CharacterData
): Promise<CreateCharacterResponse> => {
  try {
    if (!characterData.creator || characterData.creator.trim() === '') return { error: 'Creator is required.' };

    const characterUuid = uuidv4();
    if (!characterUuid) throw new Error('Failed to generate UUID.');

    const { textarea_token, char_uuid, tags, ...rest } = characterData;
    const cleanedTags = cleanTags(tags);

    const insertData = { char_uuid: characterUuid, ...rest, tags: cleanedTags };
    const { data, error } = await supabase.from('characters').insert([insertData]);

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
  characterData: CharacterData
): Promise<CreateCharacterResponse> => {
  try {
    if (!characterData.creator || characterData.creator.trim() === '') return { error: 'Creator is required.' };
    const { char_uuid, textarea_token, tags, ...rest } = characterData;
    if (!char_uuid) return { error: 'Character UUID is required for updating.' };

    const cleanedTags = cleanTags(tags);

    const updateData = {
      ...rest,
      tags: cleanedTags ?? null,
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
