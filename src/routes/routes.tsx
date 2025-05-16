import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';


function lazyNamed<T>(
  factory: () => Promise<{ [key: string]: T }>,
  exportName: string
) {
  return lazy(() =>
    factory().then(mod => ({ default: (mod as any)[exportName] }))
  );
}

const Auth = lazyNamed(() => import('./Routing/Auth'), 'Auth');
const Home = lazyNamed(() => import('./Routing/Home'), 'Home');
const Create = lazyNamed(() => import('./Routing/Create'), 'Create');
const Profile = lazyNamed(() => import('./Routing/Profile'), 'Profile');
const Chat = lazyNamed(() => import('./Routing/Chat'), 'Chat');
const Setting = lazyNamed(() => import('./Routing/Setting/Setting'), 'Setting');
const ErrorPage = lazyNamed(() => import('./Routing/404page'), 'ErrorPage');
const ChatArchives = lazyNamed(() => import('./Routing/Archive'), 'ChatArchives');


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
  { path: '/Auth', element: <Auth /> },
  { path: '/', element: <ProtectedRoute element={<Home />} /> },
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
