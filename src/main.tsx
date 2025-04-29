import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './Global.css';

import { Analytics } from '@vercel/analytics/react';
import posthog from 'posthog-js';
import { posthogConfig } from '~/config';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '~/provider/ThemeProvider';

posthog.init(posthogConfig.apiKey, {
  api_host: posthogConfig.apiHost,
  loaded: posthogConfig.loaded,
});

window.addEventListener('error', (event) => {
  posthog.captureException(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  posthog.captureException(event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <Analytics />
    </ThemeProvider>
  </StrictMode>
);
