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

    const { error } = await supabase.from('draft_characters').upsert(Character);

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
