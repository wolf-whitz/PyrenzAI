import { Character } from '@shared-types';
import { fetchCharacters } from './fetchCharacters';

export async function getRandomCharacters(
  type: string,
  maxCharacter: number,
  currentPage: number,
  extraFilters?: Record<string, any>
): Promise<{
  characters: Character[];
  totalPages: number;
  totalItems: number;
}> {
  if (type !== 'random') throw new Error('Invalid type');

  try {
    const { filter_creator_uuid, gender, tags, searchQuery } =
      extraFilters || {};

    const genderFilter = typeof gender === 'string' ? gender : null;
    const tagsFilter = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
        ? [tags]
        : null;

    const {
      characters: allCharacters,
      totalPages,
      totalItems,
    } = await fetchCharacters({
      currentPage,
      itemsPerPage: 50,
      sortBy: 'random',
      genderFilter,
      tagsFilter,
      filterCreatorUUID: filter_creator_uuid ?? null,
      search: searchQuery ?? null,
    });

    const shuffled = [...allCharacters].sort(() => Math.random() - 0.5);
    const startIndex = (currentPage - 1) * maxCharacter;
    const paged = shuffled.slice(startIndex, startIndex + maxCharacter);

    return {
      characters: paged,
      totalPages,
      totalItems,
    };
  } catch (err) {
    console.error('getRandomCharacters error:', err);
    return {
      characters: [],
      totalPages: 1,
      totalItems: 0,
    };
  }
}
