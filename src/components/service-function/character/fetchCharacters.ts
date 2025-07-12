import { supabase } from '~/Utility';
import * as Sentry from '@sentry/react';
import { Character } from '@shared-types';
import { useUserStore, useHomeStore } from '~/store';

interface FetchCharactersProps {
  currentPage: number;
  itemsPerPage: number;
  search?: string;
  charuuid?: string;
  showNsfw?: boolean;
  genderFilter?: string;
  tags?: string[];
  creatoruuid?: string;
  sortBy?: 'created_at' | 'chat_messages_count';
}

interface FetchCharactersResponse {
  character: Character | null;
  characters: Character[];
}

export const fetchCharacters = async ({
  currentPage = 1,
  itemsPerPage = 20,
  search,
  charuuid,
  showNsfw = true,
  genderFilter,
  tags = [],
  creatoruuid,
  sortBy = 'chat_messages_count',
}: FetchCharactersProps): Promise<FetchCharactersResponse> => {
  try {
    const { blocked_tags } = useUserStore.getState();
    const { setMaxPage } = useHomeStore.getState();

    const { data, error } = await supabase.rpc('get_filtered_characters', {
      page: currentPage,
      items_per_page: itemsPerPage,
      search: search?.trim() || null,
      charuuid: charuuid?.trim() || null,
      show_nsfw: showNsfw,
      blocked_tags: blocked_tags || [],
      gender_filter: genderFilter?.trim() || null,
      tag: tags || [],
      creatoruuid: creatoruuid?.trim() || null,
      sort_by: sortBy,
    });

    if (error) throw new Error(`Supabase RPC error: ${error.message}`);

    const rawCharacters = data?.characters || [];
    const characters: Character[] = rawCharacters.map((char: any) => ({
      ...char,
      id: String(char.id),
    }));

    setMaxPage(data?.max_page || 0);

    let selectedCharacter: Character | null = null;
    if (characters.length > 0) {
      const highestCount = Math.max(
        ...characters.map((c) => c.chat_messages_count || 0)
      );
      const topCharacters = characters.filter(
        (c) => c.chat_messages_count === highestCount
      );
      selectedCharacter =
        topCharacters.length === 1
          ? topCharacters[0]
          : topCharacters.sort((a, b) =>
              String(a.id).localeCompare(String(b.id))
            )[0];
    }

    return {
      character: selectedCharacter,
      characters,
    };
  } catch (err) {
    const { setMaxPage } = useHomeStore.getState();
    setMaxPage(0);
    if (err instanceof Error) {
      Sentry.captureException(err);
    } else {
      Sentry.captureMessage('An unknown error occurred.');
    }
    return {
      character: null,
      characters: [],
    };
  }
};
