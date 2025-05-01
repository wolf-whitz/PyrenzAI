import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './Global.css';

import { Analytics } from '@vercel/analytics/react';
import posthog from 'posthog-js';
import { posthogConfig } from '~/config';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import theme from '~/provider/ThemeProvider';
import i18n from "~/provider/TranslationProvider.ts"

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://2bed6b35dd70e8068f61a53812a8a5fc@o4509146215284736.ingest.us.sentry.io/4509243214725120",
  sendDefaultPii: true
});

posthog.init(posthogConfig.apiKey, {
  api_host: posthogConfig.apiHost,
  loaded: posthogConfig.loaded,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <Analytics />
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>
);
