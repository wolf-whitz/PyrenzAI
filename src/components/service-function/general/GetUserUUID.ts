import { Utils as utils } from '~/utility';
import { useUserStore } from '~/store';

export const GetUserUUID = async (): Promise<string | null> => {
  try {
    const user = await utils.db.getUser();

    if (!user) return null;

    const uuid = user.id;
    useUserStore.getState().setUserUUID(uuid);
    return uuid;
  } catch (err) {
    console.error('Error fetching user UUID:', err);
    return null;
  }
};
