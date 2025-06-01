import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types/CharacterProp';

interface FetchCharactersResponse {
  character: Character | null;
  characters: Character[];
  total: number;
  totalPages: number;
}

export async function fetchCharacters(
  requestType: string,
  page: number = 1,
  itemsPerPage: number = 10,
  search: string = ''
): Promise<FetchCharactersResponse> {
  if (requestType !== 'character') {
    throw new Error(`Invalid request_type: ${requestType}`);
  }

  const fromIndex = (page - 1) * itemsPerPage;
  const toIndex = page * itemsPerPage - 1;

  let query = supabase
    .from('characters')
    .select('*', { count: 'exact' })
    .order('chat_messages_count', { ascending: false })
    .range(fromIndex, toIndex);

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`error: ${error.message}`);
  }

  const uniqueMap = new Map<string, Character>();
  data.forEach((char: Character) => {
    char.id = String(char.id);
    if (!uniqueMap.has(char.id)) {
      uniqueMap.set(char.id, char);
    }
  });

  const characters = Array.from(uniqueMap.values());
  const total = count || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  let selectedCharacter: Character | null = null;
  if (characters.length > 0) {
    const highestCount = Math.max(
      ...characters.map((c) => c.chat_messages_count)
    );
    const highestCharacters = characters.filter(
      (c) => c.chat_messages_count === highestCount
    );

    if (highestCharacters.length === 1) {
      selectedCharacter = highestCharacters[0];
    } else {
      highestCharacters.sort((a, b) => String(a.id).localeCompare(String(b.id)));
      selectedCharacter = highestCharacters[0];
    }
  }

  return {
    character: selectedCharacter,
    characters,
    total,
    totalPages,
  };
}
