import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AppRoutes } from '~/routes/routes';
import { Spinner } from '@components';
import { supabase } from './Utility/supabaseClient';
import { usePyrenzAlert } from '~/provider';
import { useUserStore } from '~/store';

const AppContent = () => {
  const navigate = useNavigate();
  const showAlert = usePyrenzAlert();
  const [loading, setLoading] = useState(true);
  const setIsDeleted = useUserStore((state) => state.setIsDeleted);

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('user_data')
          .select('is_deleted')
          .eq('user_uuid', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
          return;
        }

        if (data?.is_deleted) {
          showAlert('Your account is deleted. Please contact an admin to immediately open your account.', 'alert');
          setIsDeleted(true);
          await supabase.auth.signOut();
        } else {
          setIsDeleted(false);
        }
      }
      setLoading(false);
    };

    checkUserStatus();
  }, [navigate, showAlert, setIsDeleted]);

  if (loading) {
    return <Spinner />;
  }

  return <Routes>{AppRoutes}</Routes>;
};

export function App() {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <AppContent />
      </Suspense>
    </Router>
  );
}
