import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomeStore } from '~/store';
import { useTranslation } from 'react-i18next';
import {
  GetHotCharacters,
  GetLatestCharacters,
  GetRandomCharacters,
  GetCharactersWithTags,
  useFetchUserUUID,
  useFetchCharacters,
} from '@components';
import { supabase } from '~/Utility/supabaseClient';
import { Utils } from '~/Utility/Utility';
import { sendUserDataToUserDataTable } from '~/api';
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
    setCharacters,
  } = useHomeStore();

  const { t } = useTranslation();
  const userUUID = useFetchUserUUID();
  const itemsPerPage = 10;
  const showAlert = usePyrenzAlert();

  const { characters } = useFetchCharacters({
    currentPage,
    search,
    itemsPerPage,
    t,
  });

  const handleButtonClick = async (
    functionName: string,
    type: string,
    maxCharacter: number,
    page: number,
    tag?: string,
    gender?: string
  ): Promise<any[]> => {
    setLoading(true);

    try {
      let rawCharacters: any[] = [];

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
          if (!tag)
            throw new Error('Tag is required for GetCharactersWithTags');
          rawCharacters = await GetCharactersWithTags(
            maxCharacter,
            page,
            type,
            tag,
            gender
          );
          break;
        default:
          throw new Error('Invalid function name');
      }

      if (rawCharacters.length === 0) {
        setCharacters([]);
        return [];
      }

      const safeCharacters = rawCharacters.map((char) => (char));

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
    loading,
    setSearch,
    setCurrentPage,
    setLoading,
    t,
    userUUID,
    itemsPerPage,
    handleButtonClick,
    fetchUserData,
  };
};
