import { Utils as utils } from '~/utility';
import { useUserStore } from '~/store';

export const GetUserUUID = async (): Promise<string | null> => {
  try {
    const user = await utils.db.getUser();

    if (!user) {
      console.warn('User not authenticated - UUID is null');
      return null;
    }

    const uuid = user.id;
    if (!uuid) {
      console.error('User object exists but ID is missing');
      return null;
    }

    useUserStore.getState().setUserUUID(uuid);
    return uuid;
  } catch (err) {
    console.error('Error fetching user UUID:', err);
    return null;
  }
};
