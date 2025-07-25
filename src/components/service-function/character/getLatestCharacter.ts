import { Character } from '@shared-types';
import { fetchCharacters } from './fetchCharacters';

interface GetLatestCharacterResponse {
  characters: Character[];
  totalItems: number;
  totalPages: number;
}

export async function getLatestCharacter(
  type: string,
  maxCharacter: number,
  currentPage: number
): Promise<GetLatestCharacterResponse> {
  if (type !== 'latest') throw new Error('Invalid type');

  const { characters, totalItems, totalPages } = await fetchCharacters({
    currentPage,
    itemsPerPage: maxCharacter,
    sortBy: 'created_at',
  });

  return {
    characters,
    totalItems,
    totalPages,
  };
}
