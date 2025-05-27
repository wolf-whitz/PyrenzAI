import { supabase } from '~/Utility/supabaseClient'
import { Character } from '@shared-types/CharacterProp'

interface FetchCharactersResponse {
  characters: Character[]
  total: number
}

export async function fetchCharacters(
  requestType: string,
  _searchTerm: string | null = null,
  _page: number = 1,
  itemsPerPage: number = 10
): Promise<FetchCharactersResponse> {
  if (requestType !== 'character') {
    throw new Error(`Invalid request_type: ${requestType}`)
  }

  const { data, error } = await supabase.rpc('weighted_character_sample')

  if (error) {
    throw new Error(`RPC error: ${error.message}`)
  }

  const uniqueMap = new Map<string, Character>()
  data.forEach((char: Character) => {
    if (!uniqueMap.has(char.id)) {
      uniqueMap.set(char.id, char)
    }
  })

  const characters = Array.from(uniqueMap.values())
    .sort((a, b) => b.chat_messages_count - a.chat_messages_count)
    .slice(0, itemsPerPage)

  return {
    characters,
    total: characters.length,
  }
}
