import { Utils as utils } from '~/Utility';
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
      ...character,
    };

    await utils.db.insert({
      tables: 'draft_characters',
      data: filteredCharacter,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error:', error);
    Sentry.captureException(error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred.',
    };
  }
};
