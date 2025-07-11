import { Utils } from '@utils';
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

    const userName = response.username;
    const personaName = response.persona_name || '';
    const avatarUrl = response.user_avatar;
    const aiCustomization = response.ai_customization;
    const preferredModel = response.preferred_model || '';
    const isAdmin = response.is_admin;
    const privateModels = response.subscription_data.private_models || {};

    const {
      setUserUUID,
      setUsername,
      setUserIcon,
      setSubscriptionPlan,
      setPreferredModel,
      setInferenceSettings,
      setIsAdmin,
      setPersonaName,
    } = useUserStore.getState();

    setUserUUID(user_uuid);
    setUsername(userName);
    setPersonaName(personaName);
    setUserIcon(avatarUrl);
    setIsAdmin(isAdmin);
    setSubscriptionPlan([response.subscription_data.tier]);
    setPreferredModel(preferredModel);

    if (aiCustomization.inference_settings) {
      setInferenceSettings(aiCustomization.inference_settings);
    }

    return {
      username: userName,
      user_avatar: avatarUrl,
      user_uuid: user_uuid,
      ai_customization: aiCustomization,
      preferred_model: preferredModel,
      is_admin: isAdmin,
      subscription_data: {
        tier: response.subscription_data.tier,
        max_token: response.subscription_data.max_token,
        model: response.subscription_data.model,
        private_models: privateModels,
      },
      persona_name: personaName,
    };
  } catch (error) {
    return { error: 'An error occurred while fetching user data' };
  }
}
