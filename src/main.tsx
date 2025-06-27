import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './GlobalStyles.css';
import { App } from './App';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import { GetTheme } from '~/theme';
import i18n from '~/provider/TranslationProvider';
import { SentryProvider } from './provider/SentryProvider';
import * as Sentry from '@sentry/react';

import ErrorBoundary from './routes/ErrorBoundary';
import { DeviceTest } from '~/Utility/DeviceTest';

import { AlertProvider } from '~/provider';
import { HelmetProvider } from 'react-helmet-async';

const theme = GetTheme();

Sentry.init({
  dsn: 'https://2bed6b35dd70e8068f61a53812a8a5fc@o4509146215284736.ingest.us.sentry.io/4509243214725120',
  sendDefaultPii: true,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

DeviceTest();

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SentryProvider>
              <AlertProvider>
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
              </AlertProvider>
            </SentryProvider>
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </I18nextProvider>
      </HelmetProvider>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
