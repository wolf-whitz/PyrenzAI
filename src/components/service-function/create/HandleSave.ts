import { supabase } from '~/Utility';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';

interface SaveDraftResponse {
  success: boolean;
  error?: string;
}

export const handleSaveDraft = async (
  character: Character,
  creatorUuid: string
): Promise<SaveDraftResponse> => {
  try {
    if (!creatorUuid) {
      return { success: false, error: 'Creator UUID is missing.' };
    }

    const filteredCharacter = {
      creator_uuid: creatorUuid,
      ...character
    };

    const { error } = await supabase
      .from('draft_characters')
      .upsert(filteredCharacter);

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
