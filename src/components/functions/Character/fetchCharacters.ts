import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';
import { useUserStore } from '~/store';

interface FetchCharactersResponse {
  character: Character | null;
  characters: Character[];
}

export async function fetchCharacters(
  requestType: string,
  page: number = 1,
  itemsPerPage: number = 10,
  search?: string,
  setMaxPage?: (maxPage: number) => void,
  show_nsfw?: boolean
): Promise<FetchCharactersResponse> {
  if (requestType !== 'character') {
    throw new Error(`Invalid request_type: ${requestType}`);
  }

  const { blocked_tags } = useUserStore.getState();

  const { data, error } = await supabase.rpc('get_filtered_characters', {
    page,
    items_per_page: itemsPerPage,
    search: search ?? null,
    show_nsfw,
    blocked_tags,
  });

  if (error) {
    throw new Error(`Supabase RPC error: ${error.message}`);
  }

  const rawCharacters = data.characters ?? [];
  const characters: Character[] = rawCharacters.map((char: any) => ({
    ...char,
    id: String(char.id),
  }));

  if (setMaxPage && data.max_page) {
    setMaxPage(data.max_page);
  }

  let selectedCharacter: Character | null = null;

  if (characters.length > 0) {
    const highestCount = Math.max(
      ...characters.map((c) => c.chat_messages_count ?? 0)
    );
    const topCharacters = characters.filter(
      (c) => (c.chat_messages_count ?? 0) === highestCount
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
}
