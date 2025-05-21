import { supabase } from '~/Utility/supabaseClient';
import * as Sentry from '@sentry/react';
import { CharacterData } from '@shared-types/CharacterProp';

interface SaveDraftResponse {
  success: boolean;
  error?: string;
}

export const handleSaveDraft = async (
  characterData: CharacterData,
  userUuid: string
): Promise<SaveDraftResponse> => {
  try {
    if (!userUuid) {
      return { success: false, error: 'User UUID is missing.' };
    }

    const characterDataToSave = { ...characterData };

    const { error } = await supabase.from('draft_characters').upsert([
      {
        user_uuid: userUuid,
        ...characterDataToSave,
        tags: characterData.tags,
      },
    ]);

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
