import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types';

interface FetchCharactersResponse {
  character: Character | null;
  characters: Character[];
}

export async function fetchCharacters(
  requestType: string,
  page: number = 1,
  itemsPerPage: number = 10,
  search?: string,
  setMaxPage?: (maxPage: number) => void
): Promise<FetchCharactersResponse> {
  if (requestType !== 'character') {
    throw new Error(`Invalid request_type: ${requestType}`);
  }

  const fromIndex = (page - 1) * itemsPerPage;
  const toIndex = page * itemsPerPage - 1;

  let query = supabase
    .from('characters')
    .select('*', { count: 'exact' });

  if (search?.trim()) {
    query = query.ilike('name', `%${search.trim()}%`);
  }

  query = query
    .order('chat_messages_count', { ascending: false })
    .range(fromIndex, toIndex);

  const { data, error, count } = await query;

  if (error) throw new Error(`error: ${error.message}`);

  const uniqueMap = new Map<string, Character>();
  data.forEach((char: Character) => {
    char.id = String(char.id);
    if (!uniqueMap.has(char.id)) {
      uniqueMap.set(char.id, char);
    }
  });

  const characters = Array.from(uniqueMap.values());
  const maxPage = Math.ceil((count ?? 0) / itemsPerPage);

  if (setMaxPage) {
    setMaxPage(maxPage);
  }

  let selectedCharacter: Character | null = null;

  if (characters.length > 0) {
    const highestCount = Math.max(...characters.map((c) => c.chat_messages_count ?? 0));
    const topCharacters = characters.filter((c) => (c.chat_messages_count ?? 0) === highestCount);
    selectedCharacter = topCharacters.length === 1
      ? topCharacters[0]
      : topCharacters.sort((a, b) => String(a.id).localeCompare(String(b.id)))[0];
  }

  return {
    character: selectedCharacter,
    characters,
  };
}
