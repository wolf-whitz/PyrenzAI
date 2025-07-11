import { supabase } from '~/Utility';
import * as Sentry from '@sentry/react';
import { usePyrenzAlert } from '~/provider';

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
  const showAlert = usePyrenzAlert();

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

    showAlert(
      'Signed up successfully! Please check your email to confirm your account. ₍ᐢ. .ᐢ₎',
      'Success'
    );

    return { success: true };
  } catch (err: any) {
    const error = new Error(err.message || 'An unexpected error occurred.');
    Sentry.captureException(error);
    throw error;
  }
};
