import React, { lazy, useEffect, useState } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { GetUserUUID } from '~/functions';
import { useUserStore } from '~/store';

const Index = lazy(() => import('./Routing/Index'));
const Auth = lazy(() => import('./Routing/Auth'));
const Home = lazy(() => import('./Routing/Home'));
const Create = lazy(() => import('./Routing/Create'));
const Profile = lazy(() => import('./Routing/Profile'));
const Chat = lazy(() => import('./Routing/Chat'));
const Setting = lazy(() => import('./Routing/Setting/Setting'));
const ErrorPage = lazy(() => import('./Routing/404page'));

const ProtectedRoute = ({
  element,
  ...props
}: {
  element: JSX.Element;
  [key: string]: any;
}) => {
  const captcha_uuid = useUserStore((state) => state.captcha_uuid);
  const captcha_expiration = useUserStore((state) => state.captcha_expiration);
  const isAuthenticated = captcha_uuid && captcha_expiration;

  if (!isAuthenticated) {
    return <Navigate to="/Auth" replace />;
  }

  return React.cloneElement(element, props);
};

const ProfileWrapper = () => {
  const [userUuid, setUserUuid] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserUuid = async () => {
      const uuid = await GetUserUUID();
      setUserUuid(uuid);
    };

    fetchUserUuid();
  }, []);

  if (userUuid === null) {
    return;
  }

  return <Profile user_uuid={userUuid} />;
};

export const routes: RouteObject[] = [
  { path: '/', element: <Index /> },
  { path: '/Auth', element: <Auth /> },
  { path: '/Home', element: <ProtectedRoute element={<Home />} /> },
  { path: '/Create', element: <ProtectedRoute element={<Create />} /> },
  {
    path: '/Profile',
    element: <ProtectedRoute element={<ProfileWrapper />} />,
  },
  {
    path: '/Chat/:conversation_id',
    element: <ProtectedRoute element={<Chat />} />,
  },
  { path: '/Settings', element: <ProtectedRoute element={<Setting />} /> },
  { path: '*', element: <ErrorPage /> },
];
