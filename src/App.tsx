import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { useUserStore } from '~/store';
import { routes as allRoutes } from '~/routes/routes';

function RoutesWrapper() {
  return useRoutes(allRoutes);
}

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

    const handleSession = async () => {
      if (!authDataString) return;

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

    handleSession();
  }, [hasHydrated, setUserUUID]);

  if (!hasHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Suspense>
        <RoutesWrapper />
      </Suspense>
    </Router>
  );
}

export default App;
