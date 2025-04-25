import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { useUserStore } from '~/store';
import { routes as allRoutes } from '~/routes/routes';
import { motion } from 'framer-motion';

const RoutesWrapper = lazy(() => Promise.resolve({ default: () => useRoutes(allRoutes) }));

const Spinner = () => (
  <motion.div
    className="flex flex-col justify-center items-center h-screen space-y-4 bg-black text-white text-center px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    <p className="text-sm animate-pulse">
      Loading <span className="font-semibold text-blue-400">Pyrenz</span>, Open Source, Free Alternative
    </p>
  </motion.div>
);

function App() {
  const {
    setHasHydrated,
    hasHydrated,
    setUserUUID,
  } = useUserStore();

  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;

    const authDataString = localStorage.getItem("sb-dojdyydsanxoblgjmzmq-auth-token");

    const handleSession = () => {
      if (!authDataString) return;

      const runAsync = async () => {
        try {
          const { access_token, refresh_token } = JSON.parse(authDataString);

          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw error;

          const { data, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !data.session) throw sessionError;

          setUserUUID(data.session.user.id);
        } catch {
          localStorage.removeItem("sb-dojdyydsanxoblgjmzmq-auth-token");
          setUserUUID(null);
        }
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(runAsync);
      } else {
        setTimeout(runAsync, 1);
      }
    };

    handleSession();
  }, [hasHydrated, setUserUUID]);

  if (!hasHydrated) {
    return <Spinner />;
  }

  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <RoutesWrapper />
      </Suspense>
    </Router>
  );
}

export default App;
