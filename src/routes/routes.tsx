import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

const Index = lazy(() => import('./Routing/Index'));
const Auth = lazy(() => import('./Routing/Auth'));
const Home = lazy(() => import('./Routing/Home'));
const Create = lazy(() => import('./Routing/Create'));
const Profile = lazy(() => import('./Routing/Profile'));
const Chat = lazy(() => import('./Routing/Chat'));
const Setting = lazy(() => import('./Routing/Setting/Setting'));
const ErrorPage = lazy(() => import('./Routing/404page'));
const ChatArchives = lazy(() => import('./Routing/Archive'));

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

const ProtectedRoute = ({
  element,
  ...props
}: {
  element: JSX.Element;
  [key: string]: any;
}) => {
  const captchaCookie = getCookie('captcha-cookie');
  const isAuthenticated = !!captchaCookie;

  if (!isAuthenticated) {
    return <Navigate to="/Auth" replace />;
  }

  return React.cloneElement(element, props);
};

export const routes: RouteObject[] = [
  { path: '/', element: <Index /> },
  { path: '/Auth', element: <Auth /> },
  { path: '/Home', element: <ProtectedRoute element={<Home />} /> },
  { path: '/Create', element: <ProtectedRoute element={<Create />} /> },
  {
    path: '/Profile/:uuid',
    element: <ProtectedRoute element={<Profile />} />,
  },
  {
    path: '/Profile',
    element: <ProtectedRoute element={<Profile />} />,
  },
  {
    path: '/Chat/:conversation_id',
    element: <ProtectedRoute element={<Chat />} />,
  },
  { path: '/Settings', element: <ProtectedRoute element={<Setting />} /> },
  { path: '/Archive', element: <ProtectedRoute element={<ChatArchives />} /> },
  { path: '*', element: <ErrorPage /> },
];
