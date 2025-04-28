import { supabase } from '~/Utility/supabaseClient';
import { Utils, AuthTokenName } from '~/Utility/Utility';
import posthog from 'posthog-js';

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

export const extractTokensFromLocalStorage = (): string | null => {
  const authData = localStorage.getItem(AuthTokenName);
  if (!authData) return null;

  try {
    const parsedData = JSON.parse(authData);
    const accessToken = parsedData?.provider_token;
    const refreshToken = parsedData?.refresh_token;

    if (accessToken && refreshToken) {
      localStorage.setItem('sb-auth-token', accessToken);
      localStorage.setItem('sb-refresh-token', refreshToken);
    }
    return authData;
  } catch (err) {
    const error = err as Error;
    posthog.captureException(error);
    return null;
  }
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
    } else {
      posthog.identify(user.id, {
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: imageUrl,
      });
    }
  } catch (err) {
    const error = err as Error;
    posthog.captureException(error);
  }
};

export const handleSignUp = async (
  email: string,
  password: string,
  isAdult: boolean
): Promise<string> => {
  if (!isAdult) {
    throw new Error('You must confirm you are 18+ to sign up.');
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;

  return 'Sign-up successful! Please check your email to verify your account.';
};

export const handleRegisterOAuthSignIn = async (
  provider: 'google' | 'discord'
): Promise<void> => {
  const { error } = await supabase.auth.signInWithOAuth({ provider });

  if (error) throw error;
  posthog.captureException(error);
};
