import posthog from 'posthog-js';
import { supabase } from '~/Utility/supabaseClient';
import * as Sentry from '@sentry/react';
import toast from 'react-hot-toast';

interface AppUser {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    is_adult?: boolean;
  };
}

export const sendUserDataToUserDataTable = async (user: AppUser) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('user_data')
      .upsert(
        {
          user_uuid: user.id,
          avatar_url: user.user_metadata?.avatar_url,
          username: user.user_metadata?.full_name || user.email?.split('@')[0],
          last_sign_in_at: new Date().toISOString(),
        },
        { onConflict: 'user_uuid' }
      );

    if (userError) throw userError;

    const { data: emailData, error: emailError } = await supabase
      .rpc('insert_email', {
        p_user_uuid: user.id,
        p_email: user.email,
      });

    if (emailError) throw emailError;

    posthog.identify(user.id, {
      email: user.email,
      full_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
    });

    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.user_metadata?.full_name || user.email?.split('@')[0],
    });
  } catch (err) {
    const error = err as Error;
    Sentry.captureException(error);
  }
};

export const handleLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    return { success: true };
  } catch (err: any) {
    const error = new Error(err.message || 'An unexpected error occurred.');
    Sentry.captureException(error);
    throw error;
  }
};

export const handleOAuthSignIn = async (provider: 'google' | 'discord') => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({ provider });

    if (error) throw new Error(error.message);

    return { success: true };
  } catch (err: any) {
    const error = new Error(err.message || 'Failed to sign in with OAuth.');
    Sentry.captureException(error);
    throw error;
  }
};

export const handleSignUp = async (
  email: string,
  password: string,
  isAdult: boolean
) => {
  try {
    if (!isAdult) {
      throw new Error('User must be an adult to sign up.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          is_adult: isAdult,
        },
      },
    });

    if (error) throw new Error(error.message);

    toast.success(
      'Signed up successfully! Please check your email to confirm your account. ₍ᐢ. .ᐢ₎'
    );

    return { success: true };
  } catch (err: any) {
    const error = new Error(err.message || 'An unexpected error occurred.');
    Sentry.captureException(error);
    throw error;
  }
};
