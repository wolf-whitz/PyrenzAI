import { Utils } from '~/Utility/Utility';
import { useUserStore } from '~/store';
import { GetUserUUID } from '@components';

interface ApiResponse {
  username: string;
  user_avatar: string;
  user_uuid: string;
  ai_customization: any;
  custom_provider?: any;
  preferred_model?: string;
  is_admin: boolean;
  subscription_data: {
    tier: string;
    max_token: number;
    model: string[];
    max_persona: string | number;
  };
}

function isApiResponse(response: any): response is ApiResponse {
  return response && typeof response.username !== 'undefined';
}

export async function GetUserData(): Promise<ApiResponse | { error: string }> {
  try {
    const user_uuid = await GetUserUUID();

    if (!user_uuid) {
      return { error: 'User UUID not found' };
    }

    const response = await Utils.post('/api/GetUserData', { user_uuid });

    if (!isApiResponse(response)) {
      return { error: 'Failed to fetch user data' };
    }

    const personaName = response.username || 'Anon';
    const avatarUrl = response.user_avatar || '';
    const aiCustomization = response.ai_customization || {};
    const customProvider = response.custom_provider || {};
    const preferredModel = response.preferred_model || 'Default Model';
    const isAdmin = response.is_admin || false;
    const subscriptionPlan = response.subscription_data?.tier || 'MELON';

    const {
      setUserUUID,
      setUsername,
      setUserIcon,
      setSubscriptionPlan,
      setPreferredModel,
      setInferenceSettings,
      setIsAdmin,
    } = useUserStore.getState();

    setUserUUID(user_uuid);
    setUsername(personaName);
    setUserIcon(avatarUrl);
    setIsAdmin(isAdmin);
    setSubscriptionPlan([subscriptionPlan.trim()]);
    setPreferredModel(preferredModel);

    if (aiCustomization.inference_settings) {
      setInferenceSettings(aiCustomization.inference_settings);
    }

    const plan = subscriptionPlan.trim().toUpperCase();
    const modelsByPlan = response.subscription_data?.model || [];

    const getSubscriptionData = (
      plan: string,
      models: string[]
    ): ApiResponse['subscription_data'] => {
      switch (plan) {
        case 'MELON':
          return {
            tier: 'MELON',
            max_token: 300,
            model: models,
            max_persona: 3,
          };
        case 'PINEAPPLE':
          return {
            tier: 'PINEAPPLE',
            max_token: 500,
            model: models,
            max_persona: 20,
          };
        case 'DURIAN':
          return {
            tier: 'DURIAN',
            max_token: 1000,
            model: models,
            max_persona: 'unlimited',
          };
        default:
          return {
            tier: 'MELON',
            max_token: 200,
            model: models,
            max_persona: 3,
          };
      }
    };

    const subscriptionData = getSubscriptionData(plan, modelsByPlan);

    return {
      username: personaName,
      user_avatar: avatarUrl,
      user_uuid: user_uuid,
      ai_customization: aiCustomization,
      custom_provider: customProvider,
      preferred_model: preferredModel,
      is_admin: isAdmin,
      subscription_data: subscriptionData,
    };
  } catch (error) {
    return { error: 'An error occurred while fetching user data' };
  }
}
