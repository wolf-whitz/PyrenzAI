import { supabase } from '~/Utility/supabaseClient';
import { useUserStore } from '~/store';

export const GetUserUUID = async (): Promise<{ uuid: string | null; icon: string | null; user_exists: boolean }> => {
  const { userUUID, userIcon } = useUserStore.getState();

  if (userUUID && userIcon) {
    return { uuid: userUUID, icon: userIcon, user_exists: true };
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching user session:', error);
      return { uuid: null, icon: null, user_exists: false };
    }

    if (data.session) {
      const uuid = data.session.user.id;
      const userMetadata = data.session.user.user_metadata;
      const icon = userMetadata?.avatar_url || userMetadata?.picture || null;

      useUserStore.getState().setUserUUID(uuid);
      useUserStore.getState().setUserIcon(icon);

      return { uuid, icon, user_exists: true };
    }

    return { uuid: null, icon: null, user_exists: false };
  } catch (error) {
    console.error('Error fetching user UUID and profile image:', error);
    return { uuid: null, icon: null, user_exists: false };
  }
};
