import React, { lazy, LazyExoticComponent } from 'react';
import { Route } from 'react-router-dom';

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

const Home = lazyNamed(() => import('./Routing/Home'), 'Home');
const Create = lazyNamed(() => import('./Routing/Create'), 'CreatePage');
const Profile = lazyNamed(() => import('./Routing/Profile'), 'ProfilePage');
const Chat = lazyNamed(() => import('./Routing/Chat'), 'ChatPage');
const Setting = lazyNamed(() => import('./Routing/Setting/Setting'), 'Setting');
const ErrorPage = lazyNamed(() => import('./Routing/404page'), 'ErrorPage');
const Subscription = lazyNamed(
  () => import('./Routing/Subscription'),
  'Subscription'
);
const Archive = lazyNamed(() => import('./Routing/Archive'), 'Archive');
const Policy = lazyNamed(() => import('./Routing/Policy'), 'Policy');
const ContentPolicy = lazyNamed(() => import('./Routing/ContentPolicy'), 'ContentPolicy');

export const AppRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/Home" element={<Home />} />
    <Route path="/Policy" element={<Policy />} />
    <Route path="/Create" element={<Create />} />
    <Route path="/Subscription" element={<Subscription />} />
    <Route path="/Archive" element={<Archive />} />
    <Route path="/Create/:uuid" element={<Create />} />
    <Route path="/Profile/:uuid" element={<Profile />} />
    <Route path="/Profile" element={<Profile />} />
    <Route path="/Chat/:chat_uuid" element={<Chat />} />
    <Route path="/Settings" element={<Setting />} />
    <Route path="/ContentPolicy" element={<ContentPolicy />} />
    <Route path="*" element={<ErrorPage />} />
  </>
);
