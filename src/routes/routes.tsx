import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { useUserStore } from '~/store';

const Index = lazy(() => import('./Routing/Index'));
const Auth = lazy(() => import('./Routing/Auth'));
const Home = lazy(() => import('./Routing/Home'));
const Create = lazy(() => import('./Routing/Create'));
const Profile = lazy(() => import('./Routing/Profile'));
const Chat = lazy(() => import('./Routing/Chat'));

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const captcha_uuid = useUserStore((state) => state.captcha_uuid);
  const captcha_expiration = useUserStore((state) => state.captcha_expiration);

  const isAuthenticated = captcha_uuid && captcha_expiration;

  if (!isAuthenticated) {
    return <Navigate to="/Auth" replace />;
  }

  return element;
};

export const routes: RouteObject[] = [
  { path: '/', element: <Index /> },
  { path: '/Auth', element: <Auth /> },
  {
    path: '/Home',
    element: <ProtectedRoute element={<Home />} />,
  },
  {
    path: '/Create',
    element: <ProtectedRoute element={<Create />} />,
  },
  {
    path: '/Profile',
    element: <ProtectedRoute element={<Profile />} />,
  },
  {
    path: '/Chat/:conversation_id',
    element: <ProtectedRoute element={<Chat />} />,
  },
];
