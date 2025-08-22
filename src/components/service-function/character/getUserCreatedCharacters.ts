import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHandleCharacterFetchClick } from '@components';
import { Character, User } from '@shared-types';
import { Utils } from '~/Utility';

type SubscriptionPlan = 'Melon' | 'Durian' | 'Pineapple';

interface UseUserCreatedCharactersResponse {
  userData: User | null;
  currentPage: number;
  maxPage: number;
  totalItems: number;
  characters: Character[];
  loading: boolean;
  handleButtonClick: (
    type: 'hot' | 'latest' | 'random' | 'tags',
    maxCharacter?: number,
    page?: number,
    tag?: string,
    gender?: string,
    search?: string
  ) => Promise<Character[]>;
  handleButtonTagClicked: (tag: string) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

export function getUserCreatedCharacters(
  creatorUUID: string | null,
  perPage: number = 20
): UseUserCreatedCharactersResponse {
  const [userData, setUserData] = useState<User | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [userLoading, setUserLoading] = useState(!creatorUUID);
  const [characterLoading, setCharacterLoading] = useState(false);
  const [maxPage, setMaxPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const fetchCharacterData = useHandleCharacterFetchClick();

  const setStoreCurrentPage = (page: number) => {
    const updated = new URLSearchParams(searchParams);
    updated.set('page', String(page));
    setSearchParams(updated);
  };

  const goToNextPage = () => {
    if (currentPage < maxPage) {
      setStoreCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setStoreCurrentPage(currentPage - 1);
    }
  };

  const handleButtonClick = async (
    type: 'hot' | 'latest' | 'random' | 'tags',
    maxCharacter: number = perPage,
    page: number = currentPage,
    tag?: string,
    gender?: string,
    search?: string
  ): Promise<Character[]> => {
    if (!creatorUUID) {
      setCharacterLoading(true);
      return [];
    }

    setStoreCurrentPage(page);
    setCharacterLoading(true);

    try {
      const result = await fetchCharacterData(
        type,
        maxCharacter,
        page,
        creatorUUID,
        tag,
        gender,
        search
      );

      setCharacters(result.characters);
      setMaxPage(result.totalPages > 0 ? result.totalPages : 1);
      setTotalItems(result.totalItems ?? result.characters.length);
      return result.characters;
    } catch (err) {
      console.error('Fetch character failed:', err);
      return [];
    } finally {
      setCharacterLoading(false);
    }
  };

  const handleButtonTagClicked = (tag: string) => {
    handleButtonClick('tags', perPage, 1, tag);
  };

  useEffect(() => {
    if (!creatorUUID) {
      setUserLoading(true);
      return;
    }

    const fetchUserData = async (uuid: string): Promise<User | null> => {
      try {
        const userRes = await Utils.db.select<{
          username?: string;
          avatar_url?: string;
          user_uuid?: string;
        }>({
          tables: 'user_data',
          columns: 'username, avatar_url, user_uuid',
          match: { user_uuid: uuid },
          paging: false,
          countOption: null,
        });

        const subRes = await Utils.db.select<{
          is_subscribed?: boolean;
          subscription_plan?: string;
        }>({
          tables: 'subscription_plan',
          columns: 'is_subscribed, subscription_plan',
          match: { user_uuid: uuid },
          paging: false,
          countOption: null,
        });

        const user = userRes.data?.[0];
        const sub = subRes.data?.[0];

        if (!user) return null;

        const plan = ['Melon', 'Durian', 'Pineapple'].includes(
          sub?.subscription_plan ?? ''
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
      } catch (err) {
        console.error('User fetch error:', err);
        return null;
      }
    };

    (async () => {
      setUserLoading(true);
      const user = await fetchUserData(creatorUUID);
      setUserData(user);
      setUserLoading(false);
    })();
  }, [creatorUUID]);

  return {
    userData,
    currentPage,
    maxPage,
    totalItems,
    characters,
    loading: userLoading || characterLoading,
    handleButtonClick,
    handleButtonTagClicked,
    goToNextPage,
    goToPrevPage,
  };
}
