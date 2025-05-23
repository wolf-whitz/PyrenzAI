import { supabase } from '~/Utility/supabaseClient';
import { useUserStore } from '~/store';

export const GetUserUUID = async (): Promise<string | null> => {
  const { userUUID } = useUserStore.getState();

  if (userUUID) {
    return userUUID;
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching user session:', error);
      return null;
    }

    if (data.session) {
      const uuid = data.session.user.id;
      useUserStore.getState().setUserUUID(uuid);
      return uuid;
    }

    return null;
  } catch (error) {
    console.error('Error fetching user UUID:', error);
    return null;
  }
};
