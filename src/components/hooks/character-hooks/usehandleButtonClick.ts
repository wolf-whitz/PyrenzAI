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
      let result;

      if (type === 'tags') {
        if (!tag) throw new Error('Missing tag');

        result = await fetchCharacters({
          currentPage: page,
          itemsPerPage: maxCharacter,
          sortBy: 'chat_messages_count',
          genderFilter: gender ?? null,
          tagsFilter: [tag],
          filterCreatorUUID: creatorUUID,
          search: search ?? null,
        });

        return {
          characters: result.characters ?? [],
          totalPages: result.totalPages ?? 1,
          totalItems: result.totalItems ?? result.characters?.length ?? 0,
        };
      }

      switch (type) {
        case 'hot':
          result = await GetHotCharacters(
            'hot',
            maxCharacter,
            page,
            'chat_messages_count',
            { filter_creator_uuid: creatorUUID }
          );
          break;

        case 'latest':
          result = await GetLatestCharacters('latest', maxCharacter, page, {
            filter_creator_uuid: creatorUUID,
          });
          break;

        case 'random':
          result = await GetRandomCharacters('random', maxCharacter, page, {
            filter_creator_uuid: creatorUUID,
          });
          break;

        default:
          result = await fetchCharacters({
            currentPage: page,
            itemsPerPage: maxCharacter,
            sortBy: 'chat_messages_count',
            genderFilter: gender ?? null,
            tagsFilter: tag ? [tag] : null,
            filterCreatorUUID: creatorUUID,
            search: search ?? null,
          });
      }

      return {
        characters: result.characters ?? [],
        totalPages: result.totalPages ?? 1,
        totalItems: result.totalItems ?? result.characters?.length ?? 0,
      };
    },
    []
  );

  return handleFetch;
};
