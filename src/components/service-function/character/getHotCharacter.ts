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
  sortBy: SortBy = 'chat_messages_count',
  extraFilters?: Record<string, any>
): Promise<GetHotCharacterResponse> {
  if (type !== 'hot') throw new Error('Invalid type');

  const { filter_creator_uuid, gender, tags, searchQuery } = extraFilters || {};

  const genderFilter = typeof gender === 'string' ? gender : null;
  const tagsFilter = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
      ? [tags]
      : null;

  const { characters, totalItems, totalPages } = await fetchCharacters({
    currentPage: page,
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
