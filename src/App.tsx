import React, { useEffect, Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { useUserStore } from '~/store';
import { routes as allRoutes } from '~/routes/routes';
import { Spinner } from '@components/index';

const RoutesWrapper = lazy(() =>
  Promise.resolve({ default: () => useRoutes(allRoutes) })
);

export default function App() {
  const { setHasHydrated, hasHydrated, setUserUUID } = useUserStore();
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;

    const authDataString = localStorage.getItem(
      'sb-dojdyydsanxoblgjmzmq-auth-token'
    );

    const handleSession = async () => {
      if (!authDataString) {
        setIsSessionChecked(true);
        return;
      }

      try {
        const { access_token, refresh_token } = JSON.parse(authDataString);
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) throw error;

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !data.session) throw sessionError;

        setUserUUID(data.session.user.id);
      } catch (error) {
        console.error('Error handling session:', error);
        localStorage.removeItem('sb-dojdyydsanxoblgjmzmq-auth-token');
        setUserUUID(null);
      } finally {
        setIsSessionChecked(true);
      }
    };

    handleSession();
  }, [hasHydrated, setUserUUID]);

  if (!hasHydrated || !isSessionChecked) {
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
