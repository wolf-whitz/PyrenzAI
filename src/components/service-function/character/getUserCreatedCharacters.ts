import { useEffect, useState } from 'react';
import { supabase } from '~/Utility';
import { GetUserUUID } from '@components';
import { Character, User } from '@shared-types';
import { useUserStore } from '~/store';

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

export const getUserCreatedCharacters = (
  creatorUUID?: string,
  page: number = 1,
  itemsPerPage: number = 20,
  refreshCharacters: boolean = false,
  sortBy: 'created_at' | 'chat_messages_count' = 'chat_messages_count'
): UseUserCreatedCharactersResponse => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    const fetchCharacters = async (uuid: string) => {
      const { show_nsfw } = useUserStore.getState();

      const { data, error } = await supabase
        .rpc('get_filtered_characters', {
          search: null,
          show_nsfw,
          blocked_tags: [],
          gender_filter: null,
          tag: [],
          creatoruuid: uuid,
          items_per_page: itemsPerPage,
          page,
          sort_by: sortBy,
          charuuid: null,
        })

        .single<FilteredCharactersResponse>();

      if (error || !data) {
        console.error('Character fetch error:', error);
        return { characters: [], max_page: 1 };
      }

      return { characters: data.characters, max_page: data.max_page };
    };

    const fetchUserDataByUuid = async (uuid: string): Promise<User | null> => {
      const { data: user, error } = await supabase
        .from('user_data')
        .select('username, avatar_url, user_uuid')
        .eq('user_uuid', uuid)
        .maybeSingle();

      if (error || !user) {
        console.error('User data error:', error);
        return null;
      }

      const { data: sub, error: subError } = await supabase
        .from('subscription_plan')
        .select('is_subscribed, subscription_plan')
        .eq('user_uuid', uuid)
        .maybeSingle();

      if (subError || !sub) {
        console.error('Subscription fetch error:', subError);
        return {
          ...user,
          user_avatar: user.avatar_url,
          is_subscribed: false,
          subscription_plan: undefined,
        };
      }

      return {
        username: user.username,
        user_avatar: user.avatar_url,
        user_uuid: user.user_uuid,
        is_subscribed: sub.is_subscribed,
        subscription_plan: sub.subscription_plan,
      };
    };

    const fetchData = async () => {
      setLoading(true);
      const uuid = creatorUUID || (await supabase.auth.getUser()).data.user?.id;
      if (!uuid) return setLoading(false);

      const user = await fetchUserDataByUuid(uuid);
      const currentUserUUID = await GetUserUUID();

      if (user) {
        const { characters, max_page } = await fetchCharacters(uuid);
        setUserData(user);
        setIsOwner(user.user_uuid === currentUserUUID);
        setCharacters(characters);
        setMaxPage(max_page);
      }

      setLoading(false);
    };

    fetchData();
  }, [creatorUUID, page, itemsPerPage, refreshCharacters, sortBy]);

  return { characters, userData, loading, isOwner, maxPage };
};
