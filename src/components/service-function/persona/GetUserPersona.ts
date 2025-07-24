import { Utils } from '~/Utility';
import { useUserStore } from '~/store';
import { GetUserUUID } from '@function';
import { getCached, setCached } from '@sdk/Cache/cacheWorkerManager';

const USER_CACHE_KEY_PREFIX = 'user:data:';

export async function GetUserData(): Promise<any> {
  const user_uuid = await GetUserUUID();
  if (!user_uuid) return { error: 'User UUID not found' };

  const cacheKey = `${USER_CACHE_KEY_PREFIX}${user_uuid}`;
  const cached = await getCached<any>(cacheKey);

  if (cached) return cached;

  try {
    const response = await Utils.post<any>('/api/GetUserData', { user_uuid });

    if (!response || typeof response.username === 'undefined') {
      return { error: 'Failed to fetch user data' };
    }

    const store = useUserStore.getState();
    store.setUserUUID(response.user_uuid);
    store.setUsername(response.username);
    store.setPersonaName(response.persona_name || '');
    store.setUserIcon(response.user_avatar);
    store.setIsAdmin(response.is_admin);
    store.setSubscriptionPlan([response.subscription_data.tier]);
    store.setPreferredModel(response.preferred_model || '');
    store.setPurchaseId(response.purchase_id || '');

    if (response.ai_customization?.inference_settings) {
      store.setInferenceSettings(response.ai_customization.inference_settings);
    }

    const modelIdentifiers = Object.entries(
      response.subscription_data.model
    ).map(([name, info]: any) => ({
      name,
      model_description: info.description,
    }));

    store.setModelIdentifiers(modelIdentifiers);
    store.setMaxTokenLimit(response.subscription_data.max_token);

    await setCached(cacheKey, response);

    return response;
  } catch {
    return { error: 'An error occurred while fetching user data' };
  }
}
