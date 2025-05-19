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
import { App } from './App';
import './GlobalStyles.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import posthog from 'posthog-js';
import { posthogConfig } from '~/config';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import { GetTheme } from '~/theme';
import i18n from '~/provider/TranslationProvider.ts';
import { ToastProvider } from '~/provider/ToastProvider';
import { SentryProvider } from './provider/SentryProvider';
import * as Sentry from '@sentry/react';

import ErrorBoundary from './routes/ErrorBoundary';

import { DeviceTest } from '~/Utility/DeviceTest';

const theme = GetTheme();

posthog.init(posthogConfig.apiKey, {
  api_host: posthogConfig.apiHost,
  loaded: posthogConfig.loaded,
});

Sentry.init({
  dsn: 'https://2bed6b35dd70e8068f61a53812a8a5fc@o4509146215284736.ingest.us.sentry.io/4509243214725120',
  sendDefaultPii: true,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log(
          '✅ Service Worker registered with scope:',
          registration.scope
        );
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

DeviceTest();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <SentryProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </SentryProvider>
          <Analytics />
          <SpeedInsights />
          <ToastProvider />
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>
);
