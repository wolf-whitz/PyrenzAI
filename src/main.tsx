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
import { SpeedInsights } from '@vercel/speed-insights/react';
import posthog from 'posthog-js';
import { posthogConfig } from '~/config';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import createCustomTheme from '~/provider/ThemeProvider';
import i18n from '~/provider/TranslationProvider.ts';
import ToastProvider from '~/provider/ToastProvider.tsx';
import SentryProvider from './provider/SentryProvider.tsx';

import ErrorBoundary from './routes/ErrorBoundary.tsx';


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
