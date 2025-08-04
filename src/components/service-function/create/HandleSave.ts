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
  if (!creatorUuid) {
    return {
      success: false,
      error: 'Creator UUID is missing.',
    };
  }

  try {
    const { id, ...characterWithoutId } = character;

    await utils.db.insert({
      tables: 'draft_characters',
      data: {
        ...characterWithoutId,
        creator_uuid: creatorUuid,
      },
    });

    return { success: true };
  } catch (error: any) {
    Sentry.captureException(error);

    return {
      success: false,
      error:
        typeof error?.message === 'string'
          ? error.message
          : 'An unexpected error occurred.',
    };
  }
};
