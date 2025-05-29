import React, { lazy, LazyExoticComponent } from 'react';
import { Navigate, Route } from 'react-router-dom';

function lazyNamed<T extends React.ComponentType<any>>(
  factory: () => Promise<Record<string, T>>,
  exportName: string
): LazyExoticComponent<T> {
  return lazy(() =>
    factory().then((mod) => {
      const Component = mod[exportName];
      if (!Component) {
        throw new Error(
          `Export "${exportName}" not found in module. Available exports: ${Object.keys(mod).join(', ')}`
        );
      }
      return { default: Component };
    })
  );
}

const Auth = lazyNamed(() => import('./Routing/Auth'), 'Auth');
const Home = lazyNamed(() => import('./Routing/Home'), 'Home');
const Create = lazyNamed(() => import('./Routing/Create'), 'CreatePage');
const Profile = lazyNamed(() => import('./Routing/Profile'), 'ProfilePage');
const Chat = lazyNamed(() => import('./Routing/Chat'), 'ChatPage');
const Setting = lazyNamed(() => import('./Routing/Setting/Setting'), 'Setting');
const ErrorPage = lazyNamed(() => import('./Routing/404page'), 'ErrorPage');
const Subscription = lazyNamed(() => import('./Routing/Subscription'), 'Subscription');
const Archive = lazyNamed(() => import('./Routing/Archive'), 'Archive');

const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';')[0];
  return undefined;
};

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = Boolean(getCookie('captcha-cookie'));
  if (!isAuthenticated) return <Navigate to="/Auth" replace />;
  return <React.Fragment key={location.pathname}>{element}</React.Fragment>;
};

export const AppRoutes = (
  <>
    <Route path="/Auth" element={<Auth />} />
    <Route path="/" element={<ProtectedRoute element={<Home />} />} />
    <Route path="/Home" element={<ProtectedRoute element={<Home />} />} />
    <Route path="/Create" element={<ProtectedRoute element={<Create />} />} />
    <Route path="/Subscription" element={<ProtectedRoute element={<Subscription />} />} />
    <Route path="/Archive" element={<ProtectedRoute element={<Archive />} />} />
    <Route path="/Create/:uuid" element={<ProtectedRoute element={<Create />} />} />
    <Route path="/Profile/:uuid" element={<ProtectedRoute element={<Profile />} />} />
    <Route path="/Profile" element={<ProtectedRoute element={<Profile />} />} />
    <Route path="/Chat/:chat_uuid" element={<ProtectedRoute element={<Chat />} />} />
    <Route path="/Settings" element={<ProtectedRoute element={<Setting />} />} />
    <Route path="*" element={<ErrorPage />} />
  </>
);
