import { useEffect, useState } from 'react';
import { GetUserUUID } from '@components';
import { Character, User } from '@shared-types';
import { fetchCharacters } from './fetchCharacters';
import { Utils } from '~/Utility';

interface UseUserCreatedCharactersResponse {
  characters: Character[];
  userData: User | null;
  loading: boolean;
  isOwner: boolean;
  maxPage: number;
}

type SubscriptionPlan = 'Melon' | 'Durian' | 'Pineapple';

export function getUserCreatedCharacters(
  creatorUUID?: string,
  page: number = 1,
  itemsPerPage: number = 20,
  refreshCharacters: boolean = false,
  sortBy: 'created_at' | 'chat_messages_count' = 'chat_messages_count'
): UseUserCreatedCharactersResponse {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    async function fetchUserDataByUuid(uuid: string): Promise<User | null> {
      try {
        const userRes = await Utils.db.select<{
          username?: string;
          avatar_url?: string;
          user_uuid?: string;
        }>({
          tables: 'user_data',
          columns: 'username, avatar_url, user_uuid',
          match: { user_uuid: uuid },
          countOption: null,
          paging: false,
        });

        const subRes = await Utils.db.select<{
          is_subscribed?: boolean;
          subscription_plan?: string;
        }>({
          tables: 'subscription_plan',
          columns: 'is_subscribed, subscription_plan',
          match: { user_uuid: uuid },
          countOption: null,
          paging: false,
        });

        const userData = userRes.data?.[0];
        const subData = subRes.data?.[0];

        if (!userData) return null;

        const validPlans: SubscriptionPlan[] = ['Melon', 'Durian', 'Pineapple'];
        const plan = validPlans.includes(subData?.subscription_plan as SubscriptionPlan)
          ? (subData?.subscription_plan as SubscriptionPlan)
          : undefined;

        return {
          username: userData.username,
          user_avatar: userData.avatar_url ?? '',
          user_uuid: userData.user_uuid,
          is_subscribed: subData?.is_subscribed ?? false,
          subscription_plan: plan,
        };
      } catch (err) {
        console.error('Failed to fetch user/subscription data:', err);
        return null;
      }
    }

    async function fetchData() {
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
        const { characters, totalPages } = await fetchCharacters({
          currentPage: page,
          itemsPerPage,
          sortBy,
          genderFilter: null,
          tagsFilter: null,
          blockedTags: null,
          showNSFW: undefined,
          filterCreatorUUID: uuid, 
        });

        setUserData(user);
        setIsOwner(user.user_uuid === currentUserUUID);
        setCharacters(characters);
        setMaxPage(totalPages);
      }

      setLoading(false);
    }

    fetchData();
  }, [creatorUUID, page, itemsPerPage, refreshCharacters, sortBy]);

  return { characters, userData, loading, isOwner, maxPage };
}
