import { useEffect, useState } from 'react';
import { GetUserUUID } from '@components';
import { Character, User } from '@shared-types';
import { useUserStore } from '~/store';
import { Utils } from '~/Utility';

interface UseUserCreatedCharactersResponse {
  characters: Character[];
  userData: User | null;
  loading: boolean;
  isOwner: boolean;
  maxPage: number;
}

type SubscriptionPlan = 'Melon' | 'Durian' | 'Pineapple';

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

      const fetchFromTable = async (table: string) => {
        try {
          const { data } = await Utils.db.select<Character>(
            table,
            '*',
            null,
            { creator_uuid: uuid },
            { from: (page - 1) * itemsPerPage, to: page * itemsPerPage - 1 },
            { column: sortBy, ascending: false }
          );
          return data || [];
        } catch {
          return [];
        }
      };

      const [publicChars, privateChars] = await Promise.all([
        fetchFromTable('public_characters'),
        fetchFromTable('private_characters'),
      ]);

      const combinedChars = [...publicChars, ...privateChars];
      return {
        characters: combinedChars,
        max_page: Math.ceil(combinedChars.length / itemsPerPage),
      };
    };

    type UserDataFromDB = {
      username?: string;
      avatar_url?: string;
      user_uuid?: string;
    };

    type SubscriptionDataFromDB = {
      is_subscribed?: boolean;
      subscription_plan?: string;
    };

    const fetchUserDataByUuid = async (uuid: string): Promise<User | null> => {
      try {
        const { data: userDataArr } = await Utils.db.select<UserDataFromDB>(
          'user_data',
          'username, avatar_url, user_uuid',
          null,
          { user_uuid: uuid }
        );
        const user = userDataArr?.[0];
        if (!user) return null;

        const { data: subDataArr } =
          await Utils.db.select<SubscriptionDataFromDB>(
            'subscription_plan',
            'is_subscribed, subscription_plan',
            null,
            { user_uuid: uuid }
          );
        const sub = subDataArr?.[0];

        const validPlans: SubscriptionPlan[] = ['Melon', 'Durian', 'Pineapple'];
        const plan = validPlans.includes(
          sub?.subscription_plan as SubscriptionPlan
        )
          ? (sub?.subscription_plan as SubscriptionPlan)
          : undefined;

        return {
          username: user.username,
          user_avatar: user.avatar_url ?? '',
          user_uuid: user.user_uuid,
          is_subscribed: sub?.is_subscribed ?? false,
          subscription_plan: plan,
        };
      } catch {
        return null;
      }
    };

    const fetchData = async () => {
      setLoading(true);
      let uuid = creatorUUID;
      if (!uuid) {
        try {
          const userResponse = await Utils.db.client.auth.getUser();
          uuid = userResponse.data.user?.id;
        } catch {
          uuid = undefined;
        }
      }
      if (!uuid) {
        setLoading(false);
        return;
      }

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
