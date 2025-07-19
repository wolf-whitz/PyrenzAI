import { useNavigate } from 'react-router-dom';
import { useHomeStore, useUserStore } from '~/store';
import { useTranslation } from 'react-i18next';
import {
  getHotCharacter as GetHotCharacters,
  getLatestCharacter as GetLatestCharacters,
  getRandomCharacters as GetRandomCharacters,
  getCharacterWithTag as GetCharactersWithTags,
  GetUserUUID,
  useFetchCharacters,
} from '@components';
import { usePyrenzAlert } from '~/provider';

export const useHomepageAPI = () => {
  const navigate = useNavigate();
  const {
    search,
    currentPage,
    setSearch,
    setCurrentPage,
    loading,
    setLoading,
    setCharacters,
  } = useHomeStore();
  const { t } = useTranslation();
  const userUUID = GetUserUUID();
  const itemsPerPage = 20;
  const showAlert = usePyrenzAlert();
  const showNSFW = useUserStore((state) => state.show_nsfw);
  const { characters } = useFetchCharacters({
    currentPage,
    search,
    itemsPerPage,
    t,
    show_nsfw: showNSFW,
  });

  const handleButtonClick = async (
    type: string,
    maxCharacter?: number,
    page?: number,
    tag?: string,
    gender?: string,
    searchQuery?: string
  ): Promise<any[]> => {
    setLoading(true);
    try {
      let rawCharacters: any[] = [];
      switch (type) {
        case 'hot':
          if (maxCharacter === undefined || page === undefined) {
            throw new Error('maxCharacter and page are required');
          }
          rawCharacters = await GetHotCharacters(type, maxCharacter, page);
          break;
        case 'latest':
          if (maxCharacter === undefined || page === undefined) {
            throw new Error('maxCharacter and page are required');
          }
          rawCharacters = await GetLatestCharacters(type, maxCharacter, page);
          break;
        case 'random':
          if (maxCharacter === undefined || page === undefined) {
            throw new Error('maxCharacter and page are required');
          }
          rawCharacters = await GetRandomCharacters(type, maxCharacter, page);
          break;
        case 'tags':
          if (tag === undefined) {
            throw new Error('Tag is required for GetCharactersWithTags');
          }
          if (maxCharacter === undefined || page === undefined) {
            throw new Error('maxCharacter and page are required');
          }
          rawCharacters = await GetCharactersWithTags(
            maxCharacter,
            page,
            type,
            tag,
            gender,
            searchQuery
          );
          break;
        default:
          throw new Error('Invalid type');
      }
      if (rawCharacters.length === 0) {
        setCharacters([]);
        return [];
      }
      const safeCharacters = rawCharacters.map((char) => char);
      setCharacters(safeCharacters);
      return safeCharacters;
    } catch (error) {
      if (error instanceof Error) {
        showAlert(t('errors.callingRPCFunction') + error.message, 'Alert');
      } else {
        showAlert(t('errors.unknown'), 'Alert');
      }
      setCharacters([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const onButtonTagClicked = async (tag: string) => {
    await handleButtonClick('tags', itemsPerPage, currentPage, tag);
  };

  return {
    navigate,
    search,
    currentPage,
    characters,
    loading,
    setSearch,
    setCurrentPage,
    setLoading,
    t,
    userUUID,
    itemsPerPage,
    handleButtonClick,
    onButtonTagClicked,
  };
};
