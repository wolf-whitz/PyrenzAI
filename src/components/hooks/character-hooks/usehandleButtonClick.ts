import { useCallback } from 'react';
import {
  getHotCharacter as GetHotCharacters,
  getLatestCharacter as GetLatestCharacters,
  getRandomCharacters as GetRandomCharacters,
  getCharacterWithTag as GetCharactersWithTags,
  fetchCharacters,
} from '@components';

import { Character } from '@shared-types';

export type CharacterFetchTypes = 'hot' | 'latest' | 'random' | 'tags';

export const useHandleCharacterFetchClick = () => {
  const handleFetch = useCallback(
    async (
      type: CharacterFetchTypes,
      maxCharacter: number,
      page: number,
      creatorUUID: string,
      tag?: string,
      gender?: string,
      search?: string
    ): Promise<{
      characters: Character[];
      totalPages: number;
      totalItems: number;
    }> => {
      if (type === 'tags') {
        if (!tag) throw new Error('Missing tag');

        return await fetchCharacters({
          currentPage: page,
          itemsPerPage: maxCharacter,
          sortBy: 'chat_messages_count',
          genderFilter: gender ?? null,
          tagsFilter: [tag],
          filterCreatorUUID: creatorUUID,
          search: search ?? null,
        });
      }

      switch (type) {
        case 'hot':
          return await GetHotCharacters('hot', maxCharacter, page, 'chat_messages_count', {
            filter_creator_uuid: creatorUUID,
          });

        case 'latest':
          return await GetLatestCharacters('latest', maxCharacter, page, {
            filter_creator_uuid: creatorUUID,
          });

        case 'random':
          return await GetRandomCharacters('random', maxCharacter, page, {
            filter_creator_uuid: creatorUUID,
          });

        default:
          return await fetchCharacters({
            currentPage: page,
            itemsPerPage: maxCharacter,
            sortBy: 'chat_messages_count',
            genderFilter: gender ?? null,
            tagsFilter: tag ? [tag] : null,
            filterCreatorUUID: creatorUUID,
            search: search ?? null,
          });
      }
    },
    []
  );

  return handleFetch;
};
