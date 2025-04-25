import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { useUserStore } from '~/store';
import { routes as allRoutes } from '~/routes/routes';

const RoutesWrapper = lazy(() => Promise.resolve({ default: () => useRoutes(allRoutes) }));

function App() {
  const {
    setHasHydrated,
    hasHydrated,
    setUserUUID,
  } = useUserStore();

  useEffect(() => {
    // Minimal initial render side effect
    setHasHydrated(true);
  }, [setHasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;

    const authDataString = localStorage.getItem("sb-dojdyydsanxoblgjmzmq-auth-token");

    // Give priority to rendering, then do heavy lifting
    const handleSession = () => {
      if (!authDataString) return;

      // Use idle time to chill and check session
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

      // Schedule when browser's got time
      if ('requestIdleCallback' in window) {
        requestIdleCallback(runAsync);
      } else {
        setTimeout(runAsync, 1); // Backup plan
      }
    };

    handleSession();
  }, [hasHydrated, setUserUUID]);

  if (!hasHydrated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Suspense fallback={<div className="text-center mt-8">Loading Routes...</div>}>
        <RoutesWrapper />
      </Suspense>
    </Router>
  );
}

export default App;
