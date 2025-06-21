import { useEffect, useState } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '@components';
import { Character, User } from '@shared-types';
import { useUserStore } from '~/store';
import { Utils } from '~/Utility/Utility';

interface FilteredCharactersResponse {
  characters: Character[];
  character_count: number;
  max_page: number;
}

interface UseUserCreatedCharactersResponse {
  characters: Character[];
  userData: User | null;
  loading: boolean;
  isOwner: boolean;
  maxPage: number;
}

export const GetUserCreatedCharacters = (
  creatorUUID?: string,
  page: number = 1,
  itemsPerPage: number = 20
): UseUserCreatedCharactersResponse => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [maxPage, setMaxPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async (uuid: string) => {
      try {
        const userData = await fetchUserDataByUuid(uuid);
        if (!userData || !userData.user_uuid) {
          setLoading(false);
          return;
        }

        const currentUserUuid = await GetUserUUID();
        if (!currentUserUuid) {
          setLoading(false);
          return;
        }

        const ownerStatus = userData.user_uuid === currentUserUuid;
        setIsOwner(ownerStatus);

        const { characters, max_page } = await fetchCharacters(userData.user_uuid, page, itemsPerPage);

        if (userData) {
          setUserData({ ...userData, isOwner: ownerStatus });
        }

        if (characters) {
          setCharacters(characters);
          setMaxPage(max_page);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    const getCreatorUuid = async (): Promise<string | null> => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error('Error fetching user:', error);
        return null;
      }

      return user.id;
    };

    const fetchUserDataByUuid = async (uuid: string): Promise<User | null> => {
      const { data, error } = await supabase
        .from('user_data')
        .select('username, avatar_url, user_uuid')
        .eq('user_uuid', uuid)
        .maybeSingle();

      if (error || !data) {
        console.error('Error fetching user data:', error);
        return null;
      }
      return {
        username: data.username,
        user_avatar: data.avatar_url,
        user_uuid: data.user_uuid
      };
    };

    const fetchCharacters = async (creatorUUID: string, page: number, itemsPerPage: number) => {
      const { show_nsfw } = useUserStore.getState();

      const { data, error } = await supabase.rpc('get_filtered_characters', {
        search: null,
        show_nsfw: show_nsfw,
        blocked_tags: [],
        gender_filter: null,
        tag: [],
        creatoruuid: creatorUUID,
        items_per_page: itemsPerPage,
        page: page,
      }).single<FilteredCharactersResponse>();

      if (error || !data) {
        console.error('Error fetching characters:', error);
        return { characters: null, max_page: 1 };
      }

      return { characters: data.characters, max_page: data.max_page };
    };

    const resolveUuid = async () => {
      const uuid = creatorUUID || await getCreatorUuid();
      if (uuid) {
        await fetchData(uuid);
      } else {
        setLoading(false);
      }
    };

    resolveUuid();
  }, [creatorUUID, page, itemsPerPage]);

  return { characters, userData, loading, isOwner, maxPage };
};
