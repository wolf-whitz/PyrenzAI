import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';

function lazyNamed<T>(
  factory: () => Promise<{ [key: string]: T }>,
  exportName: string
) {
  return lazy(() =>
    factory().then((mod) => ({ default: (mod as any)[exportName] }))
  );
}

const Auth = lazyNamed(() => import('./Routing/Auth'), 'Auth');
const Home = lazyNamed(() => import('./Routing/Home'), 'Home');
const Create = lazyNamed(() => import('./Routing/Create'), 'CreatePage');
const Profile = lazyNamed(() => import('./Routing/Profile'), 'ProfilePage');
const Chat = lazyNamed(() => import('./Routing/Chat'), 'ChatPage');
const Setting = lazyNamed(() => import('./Routing/Setting/Setting'), 'Setting');
const ErrorPage = lazyNamed(() => import('./Routing/404page'), 'ErrorPage');

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';')[0];
};

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = !!getCookie('captcha-cookie');

  if (!isAuthenticated) return <Navigate to="/Auth" replace />;

  return <React.Fragment key={location.pathname}>{element}</React.Fragment>;
};

export const AppRoutes = (
  <>
    <Route path="/Auth" element={<Auth />} />
    <Route path="/" element={<ProtectedRoute element={<Home />} />} />
    <Route path="/Home" element={<ProtectedRoute element={<Home />} />} />
    <Route path="/Create" element={<ProtectedRoute element={<Create />} />} />
    <Route
      path="/Create/:uuid"
      element={<ProtectedRoute element={<Create />} />}
    />
    <Route
      path="/Profile/:uuid"
      element={<ProtectedRoute element={<Profile />} />}
    />
    <Route path="/Profile" element={<ProtectedRoute element={<Profile />} />} />
    <Route
      path="/Chat/:chat_uuid"
      element={<ProtectedRoute element={<Chat />} />}
    />
    <Route
      path="/Settings"
      element={<ProtectedRoute element={<Setting />} />}
    />
    <Route path="*" element={<ErrorPage />} />
  </>
);
