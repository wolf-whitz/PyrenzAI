import { Utils } from '~/Utility';
import { useUserStore } from '~/store';
import { GetUserUUID } from '@function';

interface ModelInfo {
  plan: string;
  description: string;
}

interface PrivateModel {
  model_description: string;
  model_name: string;
}

interface PrivateModels {
  [key: string]: PrivateModel;
}

interface ApiResponse {
  username: string;
  user_avatar: string;
  user_uuid: string;
  ai_customization: any;
  preferred_model?: string;
  is_admin: boolean;
  subscription_data: {
    tier: string;
    max_token: number;
    model: { [key: string]: ModelInfo };
    private_models: PrivateModels;
  };
  persona_name?: string;
}

interface CachedUserData {
  data: ApiResponse;
  gotten_at: number;
}

function isApiResponse(response: any): response is ApiResponse {
  return response && typeof response.username !== 'undefined';
}

const CACHE_DURATION = 5 * 60 * 1000;  
let inFlightRequest: Promise<ApiResponse | { error: string }> | null = null;

export async function GetUserData(): Promise<ApiResponse | { error: string }> {
  const store = useUserStore.getState();
  const now = Date.now();

  const cached = (store as any).cachedUserData as CachedUserData | undefined;

  if (cached && now - cached.gotten_at < CACHE_DURATION) {
    return cached.data;
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = (async () => {
    try {
      const user_uuid = await GetUserUUID();
      if (!user_uuid) {
        return { error: 'User UUID not found' };
      }

      const response = await Utils.post('/api/GetUserData', { user_uuid });

      if (!isApiResponse(response)) {
        return { error: 'Failed to fetch user data' };
      }

      store.setUserUUID(user_uuid);
      store.setUsername(response.username);
      store.setPersonaName(response.persona_name || '');
      store.setUserIcon(response.user_avatar);
      store.setIsAdmin(response.is_admin);
      store.setSubscriptionPlan([response.subscription_data.tier]);
      store.setPreferredModel(response.preferred_model || '');

      if (response.ai_customization?.inference_settings) {
        store.setInferenceSettings(response.ai_customization.inference_settings);
      }

      const modelIdentifiers = Object.entries(response.subscription_data.model).map(
        ([name, info]) => ({
          name,
          model_description: info.description,
        })
      );

      store.setModelIdentifiers(modelIdentifiers);
      store.setMaxTokenLimit(response.subscription_data.max_token);

      (store as any).cachedUserData = {
        data: response,
        gotten_at: Date.now(),
      };

      return response;
    } catch (error) {
      return { error: 'An error occurred while fetching user data' };
    } finally {
      inFlightRequest = null;
    }
  })();

  return inFlightRequest;
}
