import { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { FaDiscord } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { handleLogin, handleOAuthSignIn, handleSignUp } from '@components';
import * as Sentry from '@sentry/react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '~/store';
import {
  Box,
  Modal,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  Backdrop,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PyrenzBlueButton } from '~/theme';

interface AuthenticationModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  toggleMode: () => void;
}

export function AuthenticationModal({
  mode,
  onClose,
  toggleMode: toggleModeProp,
}: AuthenticationModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);
  const { t } = useTranslation();
  const setIsLogin = useUserStore((state) => state.setIsLogin);
  const navigate = useNavigate();

  const resetCaptcha = () => {
    setShowCaptcha(false);
    setCaptchaToken(null);
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
  };

  const toggleMode = () => {
    resetCaptcha();
    toggleModeProp();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (showCaptcha && !captchaToken) {
      setError('Please complete the CAPTCHA.');
      setLoading(false);
      return;
    }

    if (!showCaptcha) {
      setShowCaptcha(true);
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        await handleLogin(email, password, captchaToken);
      } else {
        const response = await handleSignUp(
          email,
          password,
          isAdult,
          captchaToken
        );
        if (!response.success) {
          setError(t('auth.signUpFailed'));
          return;
        }
      }
      setIsLogin(true);
      onClose();
    } catch (err: any) {
      setError(err.message || t('errors.anErrorOccurred'));
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'discord') => {
    setLoading(true);
    setError('');
    try {
      await handleOAuthSignIn(provider);
      setIsLogin(true);
      onClose();
    } catch (err: any) {
      setError(err.message || t('errors.oauthError'));
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          outline: 'none',
        }}
      >
        <Box
          sx={{
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(30, 30, 47, 0.7)',
            borderRadius: '16px',
            p: 4,
            width: 400,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
            color: 'white',
            position: 'relative',
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}
          >
            {mode === 'login' ? t('buttons.login') : t('buttons.createAccount')}
          </Typography>
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <PyrenzBlueButton
              variant="outlined"
              startIcon={<FcGoogle />}
              onClick={() => handleOAuth('google')}
              disabled={loading}
              sx={{
                color: 'white',
                borderColor: '#555',
                '&:hover': { borderColor: '#888' },
              }}
            >
              <Typography variant="button">
                {mode === 'login'
                  ? t('auth.loginWithGoogle')
                  : t('auth.signUpWithGoogle')}
              </Typography>
            </PyrenzBlueButton>
            <PyrenzBlueButton
              variant="outlined"
              startIcon={<FaDiscord style={{ color: 'white' }} />}
              onClick={() => handleOAuth('discord')}
              disabled={loading}
              sx={{
                color: 'white',
                borderColor: '#5865F2',
                backgroundColor: '#5865F2',
                '&:hover': { backgroundColor: '#4752c4' },
              }}
            >
              <Typography variant="button">
                {mode === 'login'
                  ? t('auth.loginWithDiscord')
                  : t('auth.signUpWithDiscord')}
              </Typography>
            </PyrenzBlueButton>
          </Box>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }}>
            <Typography variant="caption" color="text.secondary">
              {t('auth.or')}
            </Typography>
          </Divider>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label={t('auth.email')}
              type="email"
              placeholder={t('auth.yourEmailAddress')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#fff' } }}
            />
            <TextField
              label={t('auth.password')}
              type="password"
              placeholder={t('auth.yourPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#fff' } }}
            />
            {mode === 'register' && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAdult}
                    onChange={() => setIsAdult(!isAdult)}
                    sx={{ color: '#fff', '&.Mui-checked': { color: '#fff' } }}
                  />
                }
                label={
                  <Typography variant="body2">{t('auth.confirm18')}</Typography>
                }
                sx={{ color: '#fff' }}
              />
            )}
            {showCaptcha && (
              <HCaptcha
                sitekey="3310c5ee-9cec-4026-a2ba-02ca73d24f9c"
                onVerify={onCaptchaChange}
                ref={captchaRef}
              />
            )}
            <PyrenzBlueButton
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                backgroundColor: '#3f51b5',
                '&:hover': { backgroundColor: '#334296' },
              }}
            >
              {loading
                ? `${mode === 'login' ? t('auth.loggingIn') : t('auth.signingUp')}...`
                : mode === 'login'
                  ? t('buttons.login')
                  : t('buttons.signUp')}
            </PyrenzBlueButton>
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 3, textAlign: 'center', color: '#aaa' }}
          >
            By continuing, you agree to our{' '}
            <Typography
              component="span"
              variant="body2"
              onClick={() => navigate('/Policy')}
              sx={{
                color: '#3f51b5',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Privacy Policy
            </Typography>
            .
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: '#aaa' }}
          >
            {mode === 'login'
              ? t('auth.dontHaveAccount')
              : t('auth.alreadyHaveAccount')}{' '}
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: '#3f51b5',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={toggleMode}
            >
              {mode === 'login' ? t('buttons.register') : t('buttons.login')}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}
