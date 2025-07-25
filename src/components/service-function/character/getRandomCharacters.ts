import { Character } from '@shared-types';
import { fetchCharacters } from './fetchCharacters';

export async function getRandomCharacters(
  type: string,
  maxCharacter: number,
  currentPage: number
): Promise<{ characters: Character[]; totalPages: number }> {
  if (type !== 'random') throw new Error('Invalid type');

  try {
    const { characters: allCharacters, totalPages } = await fetchCharacters({
      currentPage,
      itemsPerPage: 20,
      sortBy: 'random',
    });

    const shuffled = [...allCharacters].sort(() => Math.random() - 0.5);
    const startIndex = (currentPage - 1) * maxCharacter;
    const paged = shuffled.slice(startIndex, startIndex + maxCharacter);

    return {
      characters: paged,
      totalPages,
    };
  } catch (err) {
    console.error('getRandomCharacters error:', err);
    return {
      characters: [],
      totalPages: 1,
    };
  }
}
