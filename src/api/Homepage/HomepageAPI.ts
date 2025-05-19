import { useNavigate } from 'react-router-dom';
import { useHomeStore } from '~/store';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
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
import { Character, CharacterCardProps } from '@shared-types/CharacterProp';

interface PostResponse {
  success: boolean;
}

export const useHomepageAPI = () => {
  const navigate = useNavigate();
  const {
    search,
    currentPage,
    characters,
    total,
    loading,
    bgImage,
    setSearch,
    setCurrentPage,
    setCharacters,
    setTotal,
    setLoading,
  } = useHomeStore();

  const { t } = useTranslation();
  const userUUID = useFetchUserUUID();
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  useSyncSearchParams({ search, currentPage, setSearch, setCurrentPage });

  useFetchCharacters({
    currentPage,
    search,
    itemsPerPage,
    setCharacters,
    setTotal,
    setLoading,
    t,
  });

  const handleButtonClick = async (
    functionName: string,
    type: string,
    maxCharacter: number,
    page: number
  ) => {
    setLoading(true);
    setCharacters([]);

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
          rawCharacters = await GetCharactersWithTags(
            maxCharacter,
            page,
            type,
            search
          );
          break;
        default:
          throw new Error('Invalid function name');
      }

      const characters: Character[] = rawCharacters.map((char) => ({
        id: char.id,
        char_uuid: char.char_uuid,
        name: char.name,
        description: char.description,
        creator: char.creator,
        creator_uuid: char.creator_uuid,
        chat_messages_count: char.chat_messages_count,
        profile_image: char.profile_image,
        tags: char.tags,
        is_public: char.is_public,
        token_total: char.token_total,
      }));

      setCharacters(characters);
      console.log('Fetched characters:', characters);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(t('errors.callingRPCFunction') + error.message);
      } else {
        toast.error(t('errors.unknown'));
      }
    } finally {
      setLoading(false);
    }
  };

  const transformCharacter = (char: Character): CharacterCardProps => ({
    id: char.id,
    char_uuid: char.char_uuid,
    name: char.name,
    description: char.description,
    creator: char.creator,
    creator_uuid: char.creator_uuid,
    chat_messages_count: char.chat_messages_count,
    profile_image: char.profile_image,
    tags: char.tags,
    is_public: char.is_public ?? false,
    token_total: char.token_total,
    isLoading: false,
  });

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const userData = {
        userUUID: user.id,
      };

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
  };

  return {
    navigate,
    search,
    currentPage,
    characters,
    total,
    loading,
    bgImage,
    setSearch,
    setCurrentPage,
    setCharacters,
    setTotal,
    setLoading,
    t,
    userUUID,
    itemsPerPage,
    totalPages,
    handleButtonClick,
    transformCharacter,
    fetchUserData,
  };
};
