import { Character } from '@shared-types';
import { fetchCharacters } from './fetchCharacters';

type SortBy = 'chat_messages_count' | 'created_at';

interface GetHotCharacterResponse {
  characters: Character[];
  totalItems: number;
  totalPages: number;
}

export async function getHotCharacter(
  type: string,
  maxCharacter: number,
  page: number,
  sortBy: SortBy = 'chat_messages_count'
): Promise<GetHotCharacterResponse> {
  if (type !== 'hot') throw new Error('Invalid type');

  const { characters, totalItems, totalPages } = await fetchCharacters({
    currentPage: page,
    itemsPerPage: maxCharacter,
    sortBy,
  });

  return {
    characters,
    totalItems,
    totalPages,
  };
}
