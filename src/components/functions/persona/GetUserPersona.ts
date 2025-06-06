import { supabase } from '~/Utility/supabaseClient';
import { useUserStore } from '~/store';

interface UserDataResponse {
  username: string;
  user_avatar: string;
  ai_customization: any;
  subscription_data: {
    tier: string;
    max_token: number;
    model: string[];
    max_persona: string | number;
  };
}

export async function GetUserData(): Promise<UserDataResponse | { error: string }> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  const { data: userData, error: userError } = await supabase
    .from('user_data')
    .select('username, avatar_url, inference_settings')
    .eq('user_uuid', user.id)
    .single();

  if (userError || !userData) {
    return { error: 'User not found' };
  }

  const { data: subscriptionPlanData, error: subscriptionError } = await supabase
    .from('subscription_plan')
    .select('subscription_plan')
    .eq('user_uuid', user.id)
    .single();

  if (subscriptionError || !subscriptionPlanData) {
    return { error: 'Subscription plan not found' };
  }

  const { data: modelIdentifiers, error: modelError } = await supabase
    .from('model_identifiers')
    .select('name, subscription_plan');

  if (modelError || !modelIdentifiers) {
    return { error: 'Model identifiers not found' };
  }

  const personaName = userData.username || 'Anon';
  const avatarUrl = userData.avatar_url || '';
  const aiCustomization = userData.inference_settings || {};

  useUserStore.getState().setSubscriptionPlan(subscriptionPlanData.subscription_plan.trim());

  const modelsByPlan = modelIdentifiers.reduce((acc, model) => {
    const plan = model.subscription_plan.trim().toUpperCase();
    if (!acc[plan]) {
      acc[plan] = [];
    }
    acc[plan].push(model.name);
    return acc;
  }, {} as Record<string, string[]>);

  const plan = subscriptionPlanData.subscription_plan.trim().toUpperCase();

  let subscriptionData;
  switch (plan) {
    case 'MELON':
      subscriptionData = {
        tier: 'MELON',
        max_token: 200,
        model: modelsByPlan['MELON'] || [],
        max_persona: 3,
      };
      break;
    case 'PINEAPPLE':
      subscriptionData = {
        tier: 'PINEAPPLE',
        max_token: 500,
        model: modelsByPlan['PINEAPPLE'] || [],
        max_persona: 20,
      };
      break;
    case 'DURIAN':
      subscriptionData = {
        tier: 'DURIAN',
        max_token: 1000,
        model: modelsByPlan['DURIAN'] || [],
        max_persona: 'unlimited',
      };
      break;
    default:
      subscriptionData = {
        tier: 'MELON',
        max_token: 200,
        model: modelsByPlan['MELON'] || [],
        max_persona: 3,
      };
      break;
  }

  return {
    username: personaName,
    user_avatar: avatarUrl,
    ai_customization: aiCustomization,
    subscription_data: subscriptionData,
  };
}
