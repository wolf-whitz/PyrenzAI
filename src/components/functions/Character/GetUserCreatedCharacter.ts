import { useEffect, useState } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '@components';
import { Character, User } from '@shared-types';
import { useUserStore } from '~/store';

interface FilteredCharactersResponse {
  characters: Character[];
  character_count: number;
  max_page: number;
}

export const GetUserCreatedCharacters = (creatorUuid?: string) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);

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

        const characters = await fetchCharacters(userData.user_uuid);

        if (userData) {
          setUserData({ ...userData, isOwner: ownerStatus });
        }

        if (characters) {
          setCharacters(characters);
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

    const fetchCharacters = async (creatorUuid: string): Promise<Character[] | null> => {
      const { show_nsfw } = useUserStore.getState();

      const { data, error } = await supabase.rpc('get_filtered_characters', {
        search: null,
        show_nsfw: show_nsfw,
        blocked_tags: [],
        gender: null,
        tag: null,
      }).single<FilteredCharactersResponse>();

      if (error || !data) {
        console.error('Error fetching characters:', error);
        return null;
      }

      return data.characters;
    };

    const resolveUuid = async () => {
      if (creatorUuid) {
        await fetchData(creatorUuid);
      } else {
        const uuid = await getCreatorUuid();
        if (uuid) {
          await fetchData(uuid);
        } else {
          setLoading(false);
        }
      }
    };

    resolveUuid();
  }, [creatorUuid]);

  return { characters, userData, loading, isOwner };
};
