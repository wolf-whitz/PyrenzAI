import { supabase } from '~/Utility/supabaseClient';

/**
 * Fetches the user UUID from Supabase.
 * @returns A promise that resolves to the user UUID or null if not found.
 * @throws Will throw an error if the Supabase client fails to fetch the session.
 * @example
 * const userUUID = await GetUserUUID();
*/

export const GetUserUUID = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching user session:', error);
      return null;
    }
    if (data.session) {
      return data.session.user.id;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user UUID:', error);
    return null;
  }
};
