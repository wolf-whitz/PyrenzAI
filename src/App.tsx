import React, { useEffect, Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { routes as allRoutes } from '~/routes/routes';
import { Spinner } from '@components';
import AOS from 'aos';
import 'aos/dist/aos.css';

const RoutesWrapper = lazy(() =>
  Promise.resolve({ default: () => useRoutes(allRoutes) })
);

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
    AOS.init({
      disable: false,
      startEvent: 'DOMContentLoaded',
      initClassName: 'aos-init',
      animatedClassName: 'aos-animate',
      useClassNames: false,
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99,
      offset: 120,
      delay: 0,
      duration: 400,
      easing: 'ease',
      once: false,
      mirror: false,
      anchorPlacement: 'top-bottom',
    });
  }, []);

  if (!isSessionChecked) {
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
