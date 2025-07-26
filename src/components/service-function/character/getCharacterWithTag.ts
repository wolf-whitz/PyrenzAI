import { Character } from '@shared-types';
import { fetchCharacters } from './fetchCharacters';

interface GetCharacterWithTagProps {
  maxCharacter: number;
  page: number;
  tag: string;
  gender?: string;
  searchQuery?: string;
  sortBy?: 'chat_messages_count' | 'created_at';
  filter_creator_uuid?: string | null;
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
  filter_creator_uuid = null,
}: GetCharacterWithTagProps): Promise<GetCharacterWithTagResponse> {
  const tagFilters = tag ? [tag] : null;

  const { characters, totalItems, totalPages } = await fetchCharacters({
    currentPage: page,
    itemsPerPage: maxCharacter,
    genderFilter: gender ?? null,
    tagsFilter: tagFilters,
    sortBy,
    search: searchQuery ?? null,
    filterCreatorUUID: filter_creator_uuid,
  });

  return {
    characters,
    totalItems,
    totalPages,
  };
}
