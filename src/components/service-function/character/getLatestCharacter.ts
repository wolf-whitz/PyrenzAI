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
  currentPage: number,
  extraFilters?: Record<string, any>
): Promise<GetLatestCharacterResponse> {
  if (type !== 'latest') throw new Error('Invalid type');

  const {
    filter_creator_uuid,
    gender,
    tags,
    searchQuery,
    sortBy = 'created_at',
  } = extraFilters || {};

  const tagsFilter = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
    ? [tags]
    : null;

  const genderFilter = typeof gender === 'string' ? gender : null;

  const { characters, totalItems, totalPages } = await fetchCharacters({
    currentPage,
    itemsPerPage: maxCharacter,
    sortBy,
    genderFilter,
    tagsFilter,
    filterCreatorUUID: filter_creator_uuid ?? null,
  });

  const filteredCharacters = searchQuery
    ? characters.filter((char) =>
        char.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : characters;

  return {
    characters: filteredCharacters,
    totalItems,
    totalPages,
  };
}
