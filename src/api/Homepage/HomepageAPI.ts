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
  useFetchCharacters,
} from '@components';
import { supabase } from '~/Utility/supabaseClient';
import { Utils } from '~/Utility/Utility';
import { usePyrenzAlert } from '~/provider';

interface PostResponse {
  success: boolean;
}

export const useHomepageAPI = (user: any) => {
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

  const fetchUserData = useCallback(async () => {
    if (user) {
      try {
        const userData = {
          username: user.user_metadata?.name,
          user_uuid: user.id,
          last_sign_in_at: user.last_sign_in_at,
          avatar_url: user.user_metadata?.avatar_url,
        };

        const { error: upsertError } = await supabase
          .from('user_data')
          .upsert([userData], { onConflict: 'user_uuid' });

        if (upsertError) {
          throw upsertError;
        }

        const emailData = {
          user_uuid: user.id,
          email: user.email,
        };

        const { error: emailUpsertError } = await supabase
          .from('emails')
          .upsert([emailData], { onConflict: 'user_uuid' });

        if (emailUpsertError) {
          throw emailUpsertError;
        }

        const response = await Utils.post('/api/createUserData', { userUUID: user.id }) as PostResponse;

        if (!response.success) {
          throw new Error('Failed to create user data via API');
        }

        console.log('User data stored successfully');
        return { success: true, user: userData };
      } catch (error) {
        console.error('Error storing user data:', error);
        return { success: false, error: 'Failed to store user data' };
      }
    }
    return { success: false, error: 'No user exists' };
  }, [user]);

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
