import { useState } from 'react';
import { FaDiscord, FaCheck, FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import { handleLogin, handleOAuthSignIn, handleSignUp } from '~/api';
import posthog from 'posthog-js';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';

interface AuthenticationModalProps {
  mode: 'login' | 'register';
  isOpen: boolean;
  onClose: () => void;
  toggleMode: () => void;
}

export function AuthenticationModal({
  mode,
  isOpen,
  onClose,
  toggleMode,
}: AuthenticationModalProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAdult, setIsAdult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await handleLogin(email, password);
      } else {
        const response = await handleSignUp(email, password, isAdult);
        if (!response.success) {
          setError(t('auth.signUpFailed'));
          return;
        }
      }
      onClose();
    } catch (err: any) {
      setError(err.message || t('errors.anErrorOccurred'));
      posthog.capture(`${mode}_error`, { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'discord') => {
    setLoading(true);
    setError('');

    try {
      await handleOAuthSignIn(provider);
      onClose();
    } catch (err: any) {
      setError(err.message || t('errors.oauthError'));
      posthog.capture('oauth_error', { provider, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[999px] bg-black bg-opacity-50" />
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <Dialog.Content
              className="relative bg-gray-900 text-white p-8 rounded-lg shadow-2xl w-[400px] border border-gray-700"
              onClick={(e) => e.stopPropagation()}
              aria-describedby="dialog-description"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>

              <Dialog.Title className="text-2xl font-bold mb-6 text-center font-baloo">
                {mode === 'login'
                  ? t('buttons.login')
                  : t('buttons.createAccount')}
              </Dialog.Title>

              <p id="dialog-description" className="sr-only">
                {mode === 'login'
                  ? t('auth.loginToAccount')
                  : t('auth.createNewAccount')}
              </p>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm text-center mb-3 font-baloo"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex flex-col gap-3 mb-5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOAuth('google')}
                  className="flex items-center justify-center gap-3 bg-white text-black py-2 rounded font-bold transition-all hover:bg-gray-200 font-baloo border border-gray-400 shadow-md"
                  disabled={loading}
                >
                  <FcGoogle className="text-xl" />
                  {mode === 'login'
                    ? t('auth.loginWithGoogle')
                    : t('auth.signUpWithGoogle')}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOAuth('discord')}
                  className="flex items-center justify-center gap-3 bg-[#5865F2] text-white py-2 rounded font-bold transition-all hover:bg-[#4651c8] font-baloo shadow-md"
                  disabled={loading}
                >
                  <FaDiscord className="text-xl" />
                  {mode === 'login'
                    ? t('auth.loginWithDiscord')
                    : t('auth.signUpWithDiscord')}
                </motion.button>
              </div>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-700"></div>
                <span className="mx-4 text-gray-400 text-sm font-baloo">
                  {t('auth.or')}
                </span>
                <div className="flex-1 border-t border-gray-700"></div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-gray-400 text-sm font-baloo">
                    {t('auth.email')}
                  </label>
                  <input
                    type="email"
                    placeholder={t('auth.yourEmailAddress')}
                    className="mt-1 p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none w-full font-baloo transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-baloo">
                    {t('auth.password')}
                  </label>
                  <input
                    type="password"
                    placeholder={t('auth.yourPassword')}
                    className="mt-1 p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none w-full font-baloo transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {mode === 'register' && (
                  <div className="flex items-center gap-3 mt-2">
                    <label
                      htmlFor="confirm18"
                      className="relative w-6 h-6 flex items-center justify-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="confirm18"
                        className="peer hidden"
                        checked={isAdult}
                        onChange={() => setIsAdult(!isAdult)}
                      />
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        className="w-6 h-6 border-2 border-gray-600 rounded-md peer-checked:border-blue-500 flex items-center justify-center transition-all duration-200"
                      >
                        <FaCheck
                          className={`w-4 h-4 text-blue-500 ${isAdult ? 'block' : 'hidden'}`}
                        />
                      </motion.div>
                    </label>
                    <span
                      className="text-gray-400 text-sm cursor-pointer font-baloo"
                      onClick={() => setIsAdult(!isAdult)}
                    >
                      {t('auth.confirm18')}
                    </span>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition-all font-baloo"
                  disabled={loading}
                >
                  {loading
                    ? `${mode === 'login' ? t('auth.loggingIn') : t('auth.signingUp')}...`
                    : mode === 'login'
                      ? t('buttons.login')
                      : t('buttons.signUp')}
                </motion.button>
              </form>

              <p className="text-gray-500 text-xs text-center mt-6 font-baloo">
                {t('auth.byContinuing')}
                <span className="text-blue-500 cursor-pointer">
                  {t('footer.legal.termsOfService')}
                </span>{' '}
                {t('auth.and')}{' '}
                <span className="text-blue-500 cursor-pointer">
                  {t('footer.legal.privacyPolicy')}
                </span>
                .
              </p>

              <hr className="mt-4 border-t-2 border-gray-700 w-4/5 mx-auto opacity-50" />

              <p className="text-gray-400 text-sm text-center mt-4 font-baloo">
                {mode === 'login'
                  ? t('auth.dontHaveAccount')
                  : t('auth.alreadyHaveAccount')}{' '}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={toggleMode}
                >
                  {mode === 'login'
                    ? t('buttons.register')
                    : t('buttons.login')}
                </span>
              </p>
            </Dialog.Content>
          </motion.div>
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>,
    document.getElementById('modal-root')!
  );
}
