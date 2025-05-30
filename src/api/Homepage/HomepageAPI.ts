import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomeStore } from '~/store';
import { useTranslation } from 'react-i18next';
import {
  GetHotCharacters,
  GetLatestCharacters,
  GetRandomCharacters,
  GetCharactersWithTags,
  useFetchUserUUID,
  useSyncSearchParams,
  useFetchCharacters,
} from '@components';
import { supabase } from '~/Utility/supabaseClient';
import { Utils } from '~/Utility/Utility';
import { sendUserDataToUserDataTable } from '~/api';
import type { Character } from '@shared-types/CharacterProp';
import { usePyrenzAlert } from '~/provider';

interface PostResponse {
  success: boolean;
}

export const useHomepageAPI = () => {
  const navigate = useNavigate();
  const {
    search,
    currentPage,
    setSearch,
    setCurrentPage,
    loading,
    setLoading,
  } = useHomeStore();

  const { t } = useTranslation();
  const userUUID = useFetchUserUUID();
  const itemsPerPage = 10;
  const showAlert = usePyrenzAlert();

  const { isOwner, characters, total, maxPage } = useFetchCharacters({
    currentPage,
    search,
    itemsPerPage,
    t,
  });

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  useSyncSearchParams({ search, currentPage, setSearch, setCurrentPage });

  const handleButtonClick = async (
    functionName: string,
    type: string,
    maxCharacter: number,
    page: number,
    tag: string
  ) => {
    setLoading(true);

    try {
      let rawCharacters: Character[] = [];

      switch (functionName) {
        case 'GetHotCharacters':
          rawCharacters = await GetHotCharacters(type, maxCharacter, page);
          break;
        case 'GetLatestCharacters':
          rawCharacters = await GetLatestCharacters(type, maxCharacter, page);
          break;
        case 'GetRandomCharacters':
          rawCharacters = await GetRandomCharacters(type, maxCharacter, page);
          break;
        case 'GetCharactersWithTags':
          rawCharacters = await GetCharactersWithTags(maxCharacter, page, type, tag);
          break;
        default:
          throw new Error('Invalid function name');
      }

      const safeCharacters = rawCharacters.map((char) => ({
        ...char,
        is_public: char.is_public ?? false,
        is_nsfw: char.is_nsfw ?? false,
        token_total: char.token_total ?? 0,
        isLoading: false,
      }));

      return safeCharacters;
    } catch (error) {
      if (error instanceof Error) {
        showAlert(t('errors.callingRPCFunction') + error.message, 'Alert');
      } else {
        showAlert(t('errors.unknown'), 'Alert');
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const userData = { userUUID: user.id };

      const response = (await Utils.post(
        '/api/createUserData',
        userData
      )) as PostResponse;

      if (response.success) {
        await sendUserDataToUserDataTable(user);
        return { success: true, user };
      } else {
        console.error('Failed to create user data');
        return { success: false, error: 'Failed to create user data' };
      }
    }
  }, []);

  return {
    navigate,
    search,
    currentPage,
    characters,
    total,
    maxPage,
    loading,
    setSearch,
    setCurrentPage,
    setLoading,
    t,
    userUUID,
    itemsPerPage,
    totalPages,
    handleButtonClick,
    fetchUserData,
    isOwner,
  };
};
