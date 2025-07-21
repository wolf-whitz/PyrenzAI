import { Utils } from '~/Utility';
import { useUserStore } from '~/store';
import { GetUserUUID } from '@function';

let inFlightRequest: Promise<any> | null = null;

export async function GetUserData(): Promise<any> {
  const store = useUserStore.getState();
  const cachedData: any = store.cachedUserData ?? null;
  const cacheAge = cachedData ? Date.now() - cachedData.gotten_at : Infinity;

  if (cachedData && cacheAge < 60_000) {
    return cachedData.data;
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = (async () => {
    try {
      const user_uuid = await GetUserUUID();
      if (!user_uuid) return { error: 'User UUID not found' };

      const response = await Utils.post<any>('/api/GetUserData', {
        user_uuid,
      });

      if (!response || typeof response.username === 'undefined') {
        return { error: 'Failed to fetch user data' };
      }

      store.setUserUUID(response.user_uuid);
      store.setUsername(response.username);
      store.setPersonaName(response.persona_name || '');
      store.setUserIcon(response.user_avatar);
      store.setIsAdmin(response.is_admin);
      store.setSubscriptionPlan([response.subscription_data.tier]);
      store.setPreferredModel(response.preferred_model || '');
      store.setPurchaseId(response.purchase_id || '');

      if (response.ai_customization?.inference_settings) {
        store.setInferenceSettings(
          response.ai_customization.inference_settings
        );
      }

      const modelIdentifiers = Object.entries(
        response.subscription_data.model
      ).map(([name, info]: any) => ({
        name,
        model_description: info.description,
      }));

      store.setModelIdentifiers(modelIdentifiers);
      store.setMaxTokenLimit(response.subscription_data.max_token);

      store.setCachedUserData({
        data: response,
        gotten_at: Date.now(),
      });

      return response;
    } catch {
      return { error: 'An error occurred while fetching user data' };
    } finally {
      inFlightRequest = null;
    }
  })();

  return inFlightRequest;
}
