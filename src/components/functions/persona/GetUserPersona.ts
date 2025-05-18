import { supabase } from '~/Utility/supabaseClient';

interface UserDataResponse {
  username: string;
  icon: string;
  subscription_data: {
    tier: string;
    max_token: number;
    model: string[];
    max_persona: string | number;
  };
}

export async function GetUserData(): Promise<
  UserDataResponse | { error: string }
> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  const { data: userData, error: userError } = await supabase
    .from('user_data')
    .select('username, avatar_url')
    .eq('user_uuid', user.id)
    .single();

  if (userError || !userData) {
    return { error: 'User not found' };
  }

  const { data: subscriptionPlanData, error: subscriptionError } =
    await supabase
      .from('subscription_plan')
      .select('subscription_plan')
      .eq('user_uuid', user.id)
      .single();

  if (subscriptionError || !subscriptionPlanData) {
    return { error: 'Subscription plan not found' };
  }

  const personaName = userData.username || 'Anon';
  const avatarUrl = userData.avatar_url || '';

  let subscriptionData;
  switch (subscriptionPlanData.subscription_plan) {
    case 'MELON':
      subscriptionData = {
        tier: 'MELON',
        max_token: 200,
        model: ['Mango Ube', 'Ube Deluxe', 'Banana Munch'],
        max_persona: 3,
      };
      break;
    case 'PINEAPPLE':
      subscriptionData = {
        tier: 'PINEAPPLE',
        max_token: 500,
        model: ['Mango Ube', 'Ube Deluxe', 'Banana Munch'],
        max_persona: 20,
      };
      break;
    case 'DURIAN':
      subscriptionData = {
        tier: 'DURIAN',
        max_token: 1000,
        model: ['Mango Ube', 'Ube Deluxe', 'Banana Munch'],
        max_persona: 'unlimited',
      };
      break;
    default:
      subscriptionData = {
        tier: 'FREE',
        max_token: 200,
        model: ['Mango Ube', 'Ube Deluxe', 'Banana Munch'],
        max_persona: 3,
      };
      break;
  }

  return {
    username: personaName,
    icon: avatarUrl,
    subscription_data: subscriptionData,
  };
}
