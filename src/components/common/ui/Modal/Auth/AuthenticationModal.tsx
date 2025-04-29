import { useState } from 'react';
import { FaDiscord, FaCheck, FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import { handleLogin, handleOAuthSignIn, handleSignUp } from '~/api';
import posthog from 'posthog-js';
import * as Dialog from '@radix-ui/react-dialog';

interface AuthenticationModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  toggleMode: () => void;
}

export default function AuthenticationModal({ mode, onClose, toggleMode }: AuthenticationModalProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAdult, setIsAdult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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
          setError('Sign up failed. Please try again.');
          return;
        }
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
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
      setError(err.message || 'Failed to sign in with OAuth.');
      posthog.capture('oauth_error', { provider, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black bg-opacity-50" />
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
                {mode === 'login' ? 'Login' : 'Create an Account'}
              </Dialog.Title>

              <p id="dialog-description" className="sr-only">
                {mode === 'login' ? 'Login to your account' : 'Create a new account'}
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
                  {mode === 'login' ? 'Login' : 'Sign Up'} with Google
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOAuth('discord')}
                  className="flex items-center justify-center gap-3 bg-[#5865F2] text-white py-2 rounded font-bold transition-all hover:bg-[#4651c8] font-baloo shadow-md"
                  disabled={loading}
                >
                  <FaDiscord className="text-xl" />
                  {mode === 'login' ? 'Login' : 'Sign Up'} with Discord
                </motion.button>
              </div>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-700"></div>
                <span className="mx-4 text-gray-400 text-sm font-baloo">
                  OR
                </span>
                <div className="flex-1 border-t border-gray-700"></div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-gray-400 text-sm font-baloo">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder='Your Email Address'
                    className="mt-1 p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none w-full font-baloo transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-baloo">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder='Your Password'
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
                        <FaCheck className={`w-4 h-4 text-blue-500 ${isAdult ? 'block' : 'hidden'}`} />
                      </motion.div>
                    </label>
                    <span
                      className="text-gray-400 text-sm cursor-pointer font-baloo"
                      onClick={() => setIsAdult(!isAdult)}
                    >
                      CONFIRM YOU ARE 18+
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
                  {loading ? `${mode === 'login' ? 'Logging in' : 'Signing up'}...` : mode === 'login' ? 'Login' : 'Sign Up'}
                </motion.button>
              </form>

              <p className="text-gray-500 text-xs text-center mt-6 font-baloo">
                By continuing, you accept our{' '}
                <span className="text-blue-500 cursor-pointer">
                  Terms of Service
                </span>{' '}
                and acknowledge our{' '}
                <span className="text-blue-500 cursor-pointer">
                  Privacy Policy
                </span>
                .
              </p>

              <hr className="mt-4 border-t-2 border-gray-700 w-4/5 mx-auto opacity-50" />

              <p className="text-gray-400 text-sm text-center mt-4 font-baloo">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={toggleMode}
                >
                  {mode === 'login' ? 'Register' : 'Login'}
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
