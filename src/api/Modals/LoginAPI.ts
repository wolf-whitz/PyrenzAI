import { supabase } from '~/Utility/supabaseClient';
import { Utils, AuthTokenName } from '~/Utility/Utility';

interface AppUser {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

interface ApiResponse {
  error?: string;
}

export const extractTokensFromLocalStorage = (): {
  accessToken?: string;
  refreshToken?: string;
} | null => {
  const authData = localStorage.getItem(AuthTokenName);
  if (!authData) return null;

  try {
    const parsedData = JSON.parse(authData);
    const accessToken = parsedData?.provider_token;
    const refreshToken = parsedData?.refresh_token;

    if (accessToken && refreshToken) {
      localStorage.setItem('sb-auth-token', accessToken);
      localStorage.setItem('sb-refresh-token', refreshToken);
      return { accessToken, refreshToken };
    }
  } catch (err) {
    console.error('Error parsing auth data:', err);
  }
  return null;
};

export const sendUserDataToSupabase = async (user: AppUser): Promise<void> => {
  const username: string = user.email?.split('@')[0] || 'UnknownUser';
  const imageUrl: string =
    user.user_metadata?.avatar_url ||
    `https://api.dicebear.com/8.x/avataaars/svg?seed=${username}`;

  try {
    const response: ApiResponse = await Utils.post<ApiResponse>('/authorized', {
      id: user.id,
      name: user.user_metadata?.full_name || username,
      imageUrl,
    });

    if (response.error) {
      console.error('Error sending user data:', response.error);
    } else {
      console.log('User data successfully sent!');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

export const handleLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    const tokens = extractTokensFromLocalStorage();
    if (tokens) {
      const authData = JSON.parse(localStorage.getItem(AuthTokenName) || '');
      const user = authData?.user;
      if (user) await sendUserDataToSupabase(user);
    }

    return { success: true };
  } catch (err: any) {
    throw new Error(err.message || 'An unexpected error occurred.');
  }
};

export const handleOAuthSignIn = async (provider: 'google' | 'discord') => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({ provider });

    if (error) throw new Error(error.message);

    const tokens = extractTokensFromLocalStorage();
    if (tokens) {
      const authData = JSON.parse(localStorage.getItem(AuthTokenName) || '');
      const user = authData?.user;
      if (user) await sendUserDataToSupabase(user);
    }

    return { success: true };
  } catch (err: any) {
    throw new Error(err.message || 'Failed to sign in with OAuth.');
  }
};
