import { supabase } from '~/Utility/supabaseClient';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';

interface SaveDraftResponse {
  success: boolean;
  error?: string;
}

export const handleSaveDraft = async (
  Character: Character,
  userUuid: string
): Promise<SaveDraftResponse> => {
  try {
    if (!userUuid) {
      return { success: false, error: 'User UUID is missing.' };
    }
    
    const allowedCharacterData = {
      user_uuid: userUuid,
      persona: Character.persona,
      name: Character.name,
      model_instructions: Character.model_instructions,
      scenario: Character.scenario,
      description: Character.description,
      first_message: Character.first_message,
      tags: Character.tags,
      gender: Character.gender,
      is_public: Character.is_public,
      is_nsfw: Character.is_nsfw,
      creator: Character.creator,
      profile_image: Character.profile_image,
      creator_uuid: Character.creator_uuid,
      char_uuid: Character.char_uuid,
    };

    const { error } = await supabase
      .from('draft_characters')
      .upsert(allowedCharacterData);

    if (error) {
      Sentry.captureException(error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
};
