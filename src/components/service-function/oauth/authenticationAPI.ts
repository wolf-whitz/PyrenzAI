import * as Sentry from '@sentry/react';
import { usePyrenzAlert } from '~/provider';
import { Utils as utils } from '~/utility';

export const handleLogin = async (email: string, password: string, captchaToken: string) => {
  try {
    const { data, error } = await utils.db.client.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      },
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
    const { error } = await utils.db.client.auth.signInWithOAuth({ provider });
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
  isAdult: boolean,
  captchaToken: string
) => {
  const showAlert = usePyrenzAlert();
  try {
    if (!isAdult) {
      throw new Error('User must be an adult to sign up.');
    }
    const { data, error } = await utils.db.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          is_adult: isAdult,
        },
        captchaToken,
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
