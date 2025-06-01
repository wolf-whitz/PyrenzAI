import { Character } from '@shared-types/CharacterProp';
import * as Sentry from '@sentry/react';
import { fetchCharacters as fetchCharactersFunction, GetUserUUID } from '@components';

export const fetchCharacters = async (
  currentPage: number,
  itemsPerPage: number,
  search: string
): Promise<{
  characters: Character[];
  isOwner: boolean;
  maxPage: number;
}> => {
  try {
    const data = await fetchCharactersFunction(
      'character',
      currentPage,
      itemsPerPage,
      search
    );

    if (!data || !data.characters || data.characters.length === 0) {
      console.log('No characters found in the API response.');
      return {
        characters: [],
        isOwner: false,
        maxPage: 0,
      };
    }

    const userUUID = await GetUserUUID();

    const formattedCharacters = data.characters.map((char) => {
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

    const totalCharacters = data.total || 0;
    const maxPage = Math.ceil(totalCharacters / itemsPerPage);

    return {
      characters: formattedCharacters,
      isOwner: formattedCharacters.some((char) => char.isOwner),
      maxPage,
    };
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage('An unknown error occurred.');
    }
    return {
      characters: [],
      isOwner: false,
      maxPage: 0,
    };
  }
};
