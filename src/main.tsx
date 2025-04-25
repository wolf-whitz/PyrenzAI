import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './Global.css';
import { Analytics } from "@vercel/analytics/react"
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "https://0335d11be39c3c075ef8f5f37e5823ac@o4509146218299392.ingest.us.sentry.io/4509214976770048",
  integrations: [
    Sentry.replayIntegration()
  ],  
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
);
