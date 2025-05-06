import { Character } from '@shared-types/CharacterProp';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';
import { fetchCharacters as fetchCharactersFunction } from '~/functions';

export const fetchCharacters = async (
  currentPage: number,
  itemsPerPage: number,
  search: string,
): Promise<{ characters: Character[]; total: number }> => {
  try {
    const data = await fetchCharactersFunction(
      'character',
      search || null,
      currentPage,
      itemsPerPage,
    );

    if (!data || !data.characters || data.characters.length === 0) {
      console.log('No characters found in the API response.');
      return {
        characters: [],
        total: 0,
      };
    }

    const formattedCharacters = data.characters.map((char: any) => {
      const parsedTags = char.tags
        ? Array.isArray(char.tags)
          ? char.tags
          : JSON.parse(char.tags)
        : [];

      return {
        id: char.id,
        name: char.name,
        description: char.description,
        creator: char.creator,
        chat_messages_count: char.chat_messages_count ?? 0,
        profile_image: char.profile_image,
        tags: parsedTags.map((tag: any) =>
          typeof tag === 'string' || typeof tag === 'number'
            ? String(tag).trim().replace(/[\[\]"]/g, '')
            : ''
        ),
        is_public: char.is_public,
        input_char_uuid: char.char_uuid,
        token_total: char.token_total ?? 0,
      };
    });

    return {
      characters: formattedCharacters,
      total: data.total || 0,
    };
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      toast.error('Error fetching characters: ' + error.message);
    } else {
      Sentry.captureMessage('An unknown error occurred.');
      toast.error('An unknown error occurred.');
    }
    return {
      characters: [],
      total: 0,
    };
  }
};
