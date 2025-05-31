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
  itemsPerPage: number = 10
): Promise<FetchCharactersResponse> {
  if (requestType !== 'character') {
    throw new Error(`Invalid request_type: ${requestType}`);
  }

  const fromIndex = (page - 1) * itemsPerPage;
  const toIndex = page * itemsPerPage - 1;

  const { data, error, count } = await supabase
    .from('characters')
    .select('*', { count: 'exact' })
    .order('chat_messages_count', { ascending: false })
    .range(fromIndex, toIndex);

  if (error) {
    throw new Error(`error: ${error.message}`);
  }

  const uniqueMap = new Map<string, Character>();
  data.forEach((char: Character) => {
    if (!uniqueMap.has(char.id)) {
      uniqueMap.set(char.id, char);
    }
  });

  const characters = Array.from(uniqueMap.values());
  const total = count || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  // PICKING LOGIC INLINE

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
      // Tie breaker: pick lex lowest id among tied
      highestCharacters.sort((a, b) => a.id.localeCompare(b.id));
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
