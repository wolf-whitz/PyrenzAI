import { useEffect, useState } from 'react';
import { supabase } from '~/Utility/supabaseClient';

type Character = {
  id: number;
  char_uuid: string;
  name: string;
  description: string;
  creator: string;
  creator_uuid: string;
  chat_messages_count: number;
  profile_image: string;
  tags: string[];
  is_public: boolean;
  token_total: number;
};

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
    const fetchCharacters = async (creatorUuid: string) => {
      try {
        const { data: chars, error } = await supabase
          .from('characters')
          .select('*')
          .eq('creator_uuid', creatorUuid);

        if (error) throw error;

        const formattedChars = chars.map((char) => {
          const cleanedTags = Array.isArray(char.tags)
            ? char.tags
            : char.tags?.split(',').map((tag: string) => tag.trim()) || [];

          return {
            id: char.id,
            char_uuid: char.char_uuid,
            name: char.name,
            description: char.description,
            creator: char.creator,
            creator_uuid: char.creator_uuid,
            chat_messages_count: char.chat_messages_count ?? 0,
            profile_image: char.profile_image,
            tags: cleanedTags,
            is_public: char.is_public,
            token_total: char.token_total ?? 0,
          };
        });

        setCharacters(formattedChars);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    const fetchUserData = async (): Promise<string | null> => {
      try {
        let userUuidToUse = uuid;

        if (!userUuidToUse) {
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();

          if (authError || !user)
            throw authError ?? new Error('No user session');
          userUuidToUse = user.id;
        }
        const { data: userData, error } = await supabase
          .from('public_user_profiles')
          .select('username, avatar_url, user_uuid')
          .eq('user_uuid', userUuidToUse)
          .maybeSingle();

        if (error || !userData) {
          setUserData(null);
          return null;
        }

        setUserData(userData as UserData);
        return userData.user_uuid;
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
        return null;
      }
    };

    const loadData = async () => {
      const creatorUuid = await fetchUserData();
      if (creatorUuid) {
        await fetchCharacters(creatorUuid);
      }
      setLoading(false);
    };

    loadData();
  }, [uuid]);

  return { characters, userData, loading };
};
