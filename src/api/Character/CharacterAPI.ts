import { Character } from '@shared-types/CharacterProp';
import * as Sentry from '@sentry/react';
import { fetchCharacters as fetchCharactersFunction, GetUserUUID } from '@components';
import { PyrenzAlert } from '@components';

export const fetchCharacters = async (
  currentPage: number,
  itemsPerPage: number,
  search: string
): Promise<{ characters: Character[]; total: number; isOwner: boolean }> => {
  try {
    const data = await fetchCharactersFunction(
      'character',
      search || null,
      currentPage,
      itemsPerPage
    );

    if (!data || !data.characters || data.characters.length === 0) {
      console.log('No characters found in the API response.');
      return {
        characters: [],
        total: 0,
        isOwner: false,
      };
    }

    const userUUID = await GetUserUUID();

    const formattedCharacters = data.characters.map((char: any) => {
      const isOwner = char.creator_uuid === userUUID;

      return {
        id: char.id.toString(),
        name: char.name || '',
        description: char.description || '',
        creator: char.creator || null,
        creator_uuid: char.creator_uuid || '',
        chat_messages_count: char.chat_messages_count ?? 0,
        profile_image: char.profile_image || '',
        tags: char.tags || [],
        is_public: !!char.is_public,
        is_nsfw: false,
        char_uuid: char.char_uuid || '',
        token_total: char.token_total ?? 0,
        isLoading: false,
        isOwner,
      };
    });

    return {
      characters: formattedCharacters,
      total: data.total || 0,
      isOwner: formattedCharacters.some(char => char.isOwner),
    };
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      PyrenzAlert('Error fetching characters: ' + error.message, 'Alert');
    } else {
      Sentry.captureMessage('An unknown error occurred.');
      PyrenzAlert('An unknown error occurred.', 'Alert');
    }
    return {
      characters: [],
      total: 0,
      isOwner: false,
    };
  }
};
