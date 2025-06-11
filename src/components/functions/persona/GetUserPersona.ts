import { Utils } from '~/Utility/Utility';
import { useUserStore } from '~/store';
import { GetUserUUID } from '../General/GetUserUUID';

interface ApiResponse {
  username: string;
  user_avatar: string;
  ai_customization: any;
  custom_provider?: any;
  preferred_model?: string;
  subscription_data: {
    tier: string;
    max_token: number;
    model: string[];
    max_persona: string | number;
  };
}

export async function GetUserData(): Promise<ApiResponse | { error: string }> {
  try {
    const user_uuid = await GetUserUUID();

    if (!user_uuid) {
      return { error: 'User UUID not found' };
    }

    const response: ApiResponse = await Utils.post('/api/GetUserData', { user_uuid });

    if (!response) {
      return { error: 'Failed to fetch user data' };
    }

    const personaName = response.username || 'Anon';
    const avatarUrl = response.user_avatar || '';
    const aiCustomization = response.ai_customization || {};
    const customProvider = response.custom_provider || {};
    const preferredModel = response.preferred_model || 'Default Model';
    const subscriptionPlan = response.subscription_data?.tier || 'MELON';

    const { setSubscriptionPlan, setPreferredModel, setInferenceSettings } = useUserStore.getState();

    setSubscriptionPlan([subscriptionPlan.trim()]);
    setPreferredModel(preferredModel);

    if (aiCustomization.inference_settings) {
      setInferenceSettings(aiCustomization.inference_settings);
    }

    const plan = subscriptionPlan.trim().toUpperCase();
    const modelsByPlan = response.subscription_data?.model || [];

    const getSubscriptionData = (plan: string, models: string[]): ApiResponse['subscription_data'] => {
      switch (plan) {
        case 'MELON':
          return {
            tier: 'MELON',
            max_token: 200,
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
      ai_customization: aiCustomization,
      custom_provider: customProvider,
      preferred_model: preferredModel,
      subscription_data: subscriptionData,
    };
  } catch (error) {
    return { error: 'An error occurred while fetching user data' };
  }
}
