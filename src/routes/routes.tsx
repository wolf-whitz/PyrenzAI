import React from 'react';
import { Route } from 'react-router-dom';
import { Home, CreatePage, ProfilePage, ChatPage, Setting, ErrorPage, Subscription,  Archive, ContentPolicy, DocPage, Policy } from './Routing';


export const AppRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/Home" element={<Home />} />
    <Route path="/Policy" element={<Policy />} />
    <Route path="/Create" element={<CreatePage />} />
    <Route path="/Subscription" element={<Subscription />} />
    <Route path="/Archive" element={<Archive />} />
    <Route path="/Create/:char_uuid" element={<CreatePage />} />
    <Route path="/Profile/:creator_uuid" element={<ProfilePage />} />
    <Route path="/Profile" element={<ProfilePage />} />
    <Route path="/Chat/:chat_uuid" element={<ChatPage />} />
    <Route path="/Settings" element={<Setting />} />
    <Route path="/ContentPolicy" element={<ContentPolicy />} />
    <Route path="/docs/:doc_name" element={<DocPage />} />
    <Route path="/docs" element={<DocPage />} />
    <Route path="*" element={<ErrorPage />} />
  </>
);
