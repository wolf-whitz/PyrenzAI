import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { useUserStore } from '~/store';
import { routes as allRoutes } from '~/routes/routes';
import { Spinner } from "@ui/Spinner/Spinner"

const RoutesWrapper = lazy(() => Promise.resolve({ default: () => useRoutes(allRoutes) }));

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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
      <Suspense fallback={<Spinner />}>
        <RoutesWrapper />
      </Suspense>
    </Router>
  );
}

export default App;
