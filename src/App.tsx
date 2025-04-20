import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { useUserStore as UserStore } from '~/store';
import { User } from '@supabase/supabase-js';

const Home = React.lazy(() => import('~/routes/home'));
const Index = React.lazy(() => import('~/routes/index'));
const Auth = React.lazy(() => import('~/routes/auth'));
const Create = React.lazy(() => import('~/routes/create'));
const Profile = React.lazy(() => import('~/routes/profile'));
const Chat = React.lazy(() => import('~/routes/chat'));

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const captchaUUID = UserStore((state) => state.captcha_uuid);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const authDataString = localStorage.getItem("sb-dojdyydsanxoblgjmzmq-auth-token");

    const handleSession = async () => {
      try {
        if (!authDataString) return;

        const authData = JSON.parse(authDataString);
        const { access_token, refresh_token } = authData;

        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) throw error;

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !data.session) throw sessionError;

        setUser(data.session.user);
      } catch {
        localStorage.removeItem("sb-dojdyydsanxoblgjmzmq-auth-token");
        setUser(null);
      }
    };

    handleSession();
  }, [hydrated]);

  const unauthenticated = !user && !captchaUUID;

  return (
    <Router>
      <Suspense>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat/:conversation_id" element={<Chat />} />

          {unauthenticated && <Route path="/auth" element={<Auth />} />}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
