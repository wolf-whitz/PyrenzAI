import { supabase } from '~/Utility/supabaseClient';

interface UserDataResponse {
  username: string;
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
    .select('username, subscription_plan')
    .eq('user_uuid', user.id)
    .single();

  if (userError || !userData) {
    return { error: 'User not found' };
  }

  const personaName = userData.username || 'Anon';

  let subscriptionData;
  switch (userData.subscription_plan) {
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
    subscription_data: subscriptionData,
  };
}
