import { Character } from '@shared-types';
import { fetchCharacters } from './fetchCharacters';  

interface GetCharacterWithTagProps {
  maxCharacter: number;
  page: number;
  tag: string;
  gender?: string;
  searchQuery?: string;
  sortBy?: 'chat_messages_count' | 'created_at';
}

interface GetCharacterWithTagResponse {
  characters: Character[];
  totalItems: number;
  totalPages: number;
}

export async function getCharacterWithTag({
  maxCharacter,
  page,
  tag,
  gender,
  searchQuery,
  sortBy = 'chat_messages_count',
}: GetCharacterWithTagProps): Promise<GetCharacterWithTagResponse> {
  const tagFilters = tag ? [tag] : null;

  const { characters, totalItems, totalPages } = await fetchCharacters({
    currentPage: page,
    itemsPerPage: maxCharacter,
    genderFilter: gender ?? null,
    tagsFilter: tagFilters,
    sortBy,
  });

  const filtered = characters.filter((char) =>
    searchQuery
      ? char.name?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return {
    characters: filtered,
    totalItems,
    totalPages,
  };
}
