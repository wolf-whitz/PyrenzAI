import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { AppRoutes } from '~/routes/routes';
import { Spinner } from '@components';

export function App() {
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  useEffect(() => {
    const handleSession = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        if (!user) {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error handling session:', error);
      } finally {
        setIsSessionChecked(true);
      }
    };

    handleSession();
  }, []);

  if (!isSessionChecked) return <Spinner />;

  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Routes>{AppRoutes}</Routes>
      </Suspense>
    </Router>
  );
}
