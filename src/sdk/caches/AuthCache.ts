import type { SupabaseClient, User } from '@supabase/supabase-js';

type CachedUser = {
  user: User | null;
  fetchedAt: number;
};

const CACHE_DURATION = 5 * 60 * 1000;
let cachedUser: CachedUser | null = null;
let inflightRequest: Promise<User | null> | null = null;

export const getCachedUser = async (
  client: SupabaseClient
): Promise<User | null> => {
  const now = Date.now();

  if (cachedUser && now - cachedUser.fetchedAt < CACHE_DURATION) {
    return cachedUser.user;
  }

  if (inflightRequest) return inflightRequest;

  inflightRequest = (async () => {
    try {
      const { data, error } = await client.auth.getUser();

      if (error) {
        console.warn('Supabase auth error:', error.message);
        cachedUser = {
          user: null,
          fetchedAt: now,
        };
        return null;
      }

      const user = data.user;

      if (!user) {
        console.info('No authenticated user found');
      }

      cachedUser = {
        user,
        fetchedAt: now,
      };

      return user;
    } catch (error) {
      console.error('Error fetching user from Supabase:', error);
      return null;
    } finally {
      inflightRequest = null;
    }
  })();

  return inflightRequest;
};
