import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types/CharacterProp';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';

export const fetchCharacters = async (
  currentPage: number,
  itemsPerPage: number,
  search: string,
  user_uuid: string
): Promise<{ characters: Character[]; total: number }> => {
  try {
    const { data, error } = await supabase.rpc('fetch_characters', {
      request_type: 'character',
      page: currentPage,
      items_per_page: itemsPerPage,
      search_term: search || null,
      user_param_uuid: user_uuid,
    });

    if (error) {
      throw error;
    }

    if (!data || !data.characters) {
      return {
        characters: [],
        total: 0,
      };
    }

    const formattedCharacters = data.characters.map((char: any) => ({
      id: char.id,
      name: char.name,
      description: char.description,
      creator: char.creator,
      chat_messages_count: char.chat_messages_count,
      profile_image: char.profile_image,
      tags: Array.isArray(char.tags)
        ? char.tags
            .filter(
              (tag: any) => typeof tag === 'string' || typeof tag === 'number'
            )
            .map((tag: any) => String(tag).trim())
        : Object.keys(char.tags || {})
            .filter((key: string) => key.trim() !== '')
            .map((key: string) => key.trim()),
      is_public: char.is_public,
      input_char_uuid: char.input_char_uuid,
      token_total: char.token_total,
    }));

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
