import { useState, lazy, Suspense } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import { handleLogin, handleOAuthSignIn } from '~/api';

const RegisterModal = lazy(() => import('@components/index').then(module => ({ default: module.RegisterModal })));

interface LoginProps {
  onClose: () => void;
}

export default function Login({ onClose }: LoginProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showRegister, setShowRegister] = useState<boolean>(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await handleLogin(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {!showRegister ? (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 text-white p-8 rounded-lg shadow-2xl w-[400px] relative border border-gray-700"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.25, ease: 'easeOut' },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: -10,
              transition: { duration: 0.2, ease: 'easeIn' },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-center font-baloo-da-2">
              Login
            </h2>

            {error && (
              <p className="text-red-500 text-sm text-center mb-3">{error}</p>
            )}

            <div className="flex flex-col gap-3 mb-5">
              <button
                onClick={() => handleOAuth('google')}
                className="flex items-center justify-center gap-3 bg-white text-black py-2 rounded font-bold transition-all hover:bg-gray-200 font-baloo-da-2 border border-gray-400 shadow-md"
                disabled={loading}
              >
                <FcGoogle className="text-xl" />
                Login with Google
              </button>

              <button
                onClick={() => handleOAuth('discord')}
                className="flex items-center justify-center gap-3 bg-[#5865F2] text-white py-2 rounded font-bold transition-all hover:bg-[#4651c8] font-baloo-da-2 shadow-md"
                disabled={loading}
              >
                <FaDiscord className="text-xl" />
                Login with Discord
              </button>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-700"></div>
              <span className="mx-4 text-gray-400 text-sm font-baloo-da-2">
                OR
              </span>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-gray-400 text-sm font-baloo-da-2">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none w-full font-baloo-da-2 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-baloo-da-2">
                  Password
                </label>
                <input
                  type="password"
                  className="mt-1 p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none w-full font-baloo-da-2 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition-all font-baloo-da-2"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-gray-500 text-xs text-center mt-6 font-baloo-da-2">
              By continuing, you accept our{' '}
              <span className="text-blue-500 cursor-pointer">
                Terms of Service
              </span>{' '}
              and acknowledge our{' '}
              <span className="text-blue-500 cursor-pointer">Privacy Policy</span>
              .
            </p>

            <hr className="mt-4 border-t-2 border-gray-700 w-4/5 mx-auto opacity-50" />

            <p className="text-gray-400 text-sm text-center mt-4 font-baloo-da-2">
              Don't have an account?{' '}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setShowRegister(true)}
              >
                Register
              </span>
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <Suspense>
          <RegisterModal onClose={onClose} />
        </Suspense>
      )}
    </AnimatePresence>,
    document.body
  );
}
