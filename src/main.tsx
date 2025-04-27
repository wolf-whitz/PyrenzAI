import "./sentry.ts"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './Global.css';
import { Analytics } from '@vercel/analytics/react';
import { PostHogProvider } from 'posthog-js/react';

const options = {
  api_host: 'https://us.i.posthog.com',
  debug: import.meta.env.MODE === 'development',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <App />
      <Analytics />
    </PostHogProvider>
  </StrictMode>
);
