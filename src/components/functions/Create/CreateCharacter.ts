import { supabase } from '~/Utility/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react';
import { CharacterData } from '@shared-types/CharacterProp';

interface CreateCharacterResponse {
  char_uuid?: string;
  error?: string;
}

export const createCharacter = async (
  characterData: CharacterData
): Promise<CreateCharacterResponse> => {
  try {
    const characterUuid = uuidv4();
    console.log('Generated UUID:', characterUuid);

    if (!characterUuid) {
      throw new Error('Failed to generate UUID.');
    }

    const { textarea_token, char_uuid, ...filteredCharacterData } = characterData;

    const insertData = {
      char_uuid: characterUuid,
      ...filteredCharacterData,
    };

    console.log('Data to be inserted:', insertData);

    const { data, error } = await supabase
      .from('characters')
      .insert([insertData]);

    if (error) {
      console.error('Error creating character:', error);
      Sentry.captureException(error);
      return { error: error.message };
    }

    console.log('Insert successful, returned data:', data);

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
    const { char_uuid, textarea_token, ...filteredCharacterData } = characterData;

    if (!char_uuid) {
      return { error: 'Character UUID is required for updating.' };
    }

    const { data, error } = await supabase
      .from('characters')
      .update(filteredCharacterData)
      .eq('char_uuid', char_uuid);

    if (error) {
      console.error('Error updating character:', error);
      Sentry.captureException(error);
      return { error: error.message };
    }

    console.log('Update successful, returned data:', data);

    return { char_uuid: char_uuid };
  } catch (error) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    return { error: 'An unexpected error occurred.' };
  }
};
