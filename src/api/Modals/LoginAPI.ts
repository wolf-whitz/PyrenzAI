import posthog from 'posthog-js'; // Import PostHog
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
    const error = err as Error;
    posthog.captureException(error);
    console.error('Error parsing auth data:', error);
  }
  return null;
};

export const sendUserDataToSupabase = async (user: AppUser): Promise<void> => {
  const username = user.email?.split('@')[0] || 'UnknownUser';
  const imageUrl =
    user.user_metadata?.avatar_url ||
    `https://api.dicebear.com/8.x/avataaars/svg?seed=${username}`;

  try {
    const response = await Utils.post<ApiResponse>('/authorized', {
      id: user.id,
      name: user.user_metadata?.full_name || username,
      imageUrl,
    });

    if (response.error) {
      console.error('Error sending user data:', response.error);
      posthog.captureException(new Error(response.error));
    } else {
      console.log('User data successfully sent!');
      posthog.identify(user.id, {
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: imageUrl,
      });
    }
  } catch (err) {
    const error = err as Error;
    posthog.captureException(error);
    console.error('Unexpected error:', error);
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
    const error = new Error(err.message || 'An unexpected error occurred.');
    posthog.captureException(error);
    throw error;
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
    const error = new Error(err.message || 'Failed to sign in with OAuth.');
    posthog.captureException(error);
    throw error;
  }
};
