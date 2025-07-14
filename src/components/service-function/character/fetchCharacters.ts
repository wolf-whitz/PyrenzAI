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

    const buildQuery = (table: string) => {
      let query = supabase.from(table).select('*', { count: 'exact' });

      if (search) query.ilike('name', `%${search.trim()}%`);
      if (charuuid) query.eq('char_uuid', charuuid.trim());
      if (!showNsfw) query.eq('is_nsfw', false);
      if (genderFilter) query.eq('gender', genderFilter.trim());
      if (tags.length > 0) query.overlaps('tags', tags);
      if (creatoruuid) query.eq('creator_uuid', creatoruuid.trim());
      if (blocked_tags && blocked_tags.length > 0) {
        query.not('tags', 'overlaps', blocked_tags);
      }

      query.order(sortBy, { ascending: false });

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query.range(from, to);

      return query;
    };

    let { data, count, error } = await buildQuery('public_characters');

    if (error || !data || data.length === 0) {
      const fallback = await buildQuery('private_characters');
      const fallbackRes = await fallback;
      data = fallbackRes.data;
      count = fallbackRes.count;
      if (fallbackRes.error) throw fallbackRes.error;
    }

    const characters: Character[] = (data || []).map((char: any) => ({
      ...char,
      id: String(char.id),
    }));

    setMaxPage(Math.ceil((count ?? 0) / itemsPerPage));

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
