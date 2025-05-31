import { useEffect, useState } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types/CharacterProp';

type UserData = {
  username: string;
  avatar_url: string;
  user_uuid: string;
};

export const GetUserCreatedCharacters = (uuid?: string) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userUuidToUse = uuid || (await getUserUuid());
        if (!userUuidToUse) {
          setLoading(false);
          return;
        }

        const [userData, characters] = await Promise.all([
          fetchUserData(userUuidToUse),
          fetchCharacters(userUuidToUse),
        ]);

        if (userData) {
          setUserData(userData);
          updateMetaAndTitle(userData.username, userData.avatar_url);
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

    const getUserUuid = async (): Promise<string | null> => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error('Error fetching user:', error);
        return null;
      }
      return user.id;
    };

    const fetchUserData = async (
      userUuid: string
    ): Promise<UserData | null> => {
      const { data, error } = await supabase
        .from('user_data')
        .select('username, avatar_url, user_uuid')
        .eq('user_uuid', userUuid)
        .maybeSingle();

      if (error || !data) {
        console.error('Error fetching user data:', error);
        return null;
      }
      return data as UserData;
    };

    const fetchCharacters = async (
      creatorUuid: string
    ): Promise<Character[] | null> => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('creator_uuid', creatorUuid);

      if (error) {
        console.error('Error fetching characters:', error);
        return null;
      }

      return data.map((char) => ({
        id: char.id.toString(),
        char_uuid: char.char_uuid,
        name: char.name,
        description: char.description,
        creator: char.creator,
        creator_uuid: char.creator_uuid,
        chat_messages_count: char.chat_messages_count ?? 0,
        profile_image: char.profile_image,
        tags: Array.isArray(char.tags)
          ? char.tags
          : char.tags?.split(',').map((tag: string) => tag.trim()) || [],
        is_public: char.is_public,
        is_nsfw: char.is_nsfw ?? false,
        token_total: char.token_total ?? 0,
        isLoading: false,
      }));
    };

    const updateMetaAndTitle = (username: string, avatarUrl: string) => {
      document.title = username;
      const ogImages = document.querySelectorAll('meta[property="og:image"]');
      ogImages.forEach((meta) => meta.setAttribute('content', avatarUrl));
    };

    fetchData();
  }, [uuid]);

  return { characters, userData, loading };
};
