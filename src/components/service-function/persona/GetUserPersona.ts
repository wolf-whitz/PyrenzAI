import { Utils } from '~/utility';
import { useUserStore } from '~/store';
import { GetUserUUID } from '@function';

export async function GetUserData(): Promise<any> {
  const user_uuid = await GetUserUUID();
  if (!user_uuid) {
    console.warn('Cannot fetch user data: User not authenticated');
    return { error: 'User not authenticated. Please log in to continue.' };
  }

  try {
    const response = await Utils.post<any>(
      '/api/GetUserData',
      { user_uuid },
      { cache: true }
    );

    if (!response || typeof response.username === 'undefined') {
      console.error('Invalid response from GetUserData API:', response);
      return { error: 'Failed to fetch user data from server' };
    }

    const store = useUserStore.getState();

    store.setUserUUID(user_uuid);
    store.setUsername(response.username);
    store.setPersonaName(response.persona_name || response.username);
    store.setUserIcon(response.user_avatar);
    store.setIsAdmin(response.is_admin);
    store.setSubscriptionPlan([response.subscription_data.tier]);
    store.setPreferredModel(response.preferred_model || {});
    store.setPurchaseId(response.purchase_id || '');

    if (response.ai_customization) {
      store.setInferenceSettings(response.ai_customization);
    }

    const publicModels = Object.entries(response.subscription_data.model).map(
      ([name, info]: any) => ({
        name,
        model_description: info.description,
        slug: info.slug,
      })
    );

    const privateModels = Object.entries(
      response.subscription_data.private_models
    ).map(([_, info]: any) => ({
      name: info.model_name,
      model_description: info.model_description,
    }));

    store.setModelIdentifiers([...publicModels, ...privateModels]);
    store.setMaxTokenLimit(response.subscription_data.max_token);

    return response;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { error: 'An error occurred while fetching user data' };
  }
}
