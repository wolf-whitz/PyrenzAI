/**
 * @file main.tsx
 * Main entry point for the application and where we also set up the global providers such as:
 * @ThemeProvider
 * @I18nextProvider 
 * @ErrorBoundary
 * And such.
*/

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './Global.css';

import { Analytics } from '@vercel/analytics/react';
import posthog from 'posthog-js';
import { posthogConfig } from '~/config';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import createCustomTheme from '~/provider/ThemeProvider';
import i18n from '~/provider/TranslationProvider.ts';
import { Toaster } from 'react-hot-toast';

import * as Sentry from '@sentry/react';

import ErrorBoundary from './routes/ErrorBoundary.tsx';

Sentry.init({
  dsn: 'https://2bed6b35dd70e8068f61a53812a8a5fc@o4509146215284736.ingest.us.sentry.io/4509243214725120',
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});

const theme = createCustomTheme();

posthog.init(posthogConfig.apiKey, {
  api_host: posthogConfig.apiHost,
  loaded: posthogConfig.loaded,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        <Analytics />
        <Toaster position="top-right" reverseOrder={false} />
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>
);
