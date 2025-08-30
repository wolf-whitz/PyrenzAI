import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import './GlobalStyles.css';
import { App } from './App';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import { GetTheme } from '~/theme';
import i18n from '~/provider/TranslationProvider';
import { SentryProvider } from './provider/SentryProvider';
import * as Sentry from '@sentry/react';

import { ErrorBoundary } from './routes/ErrorBoundary';
import { AlertProvider, AmplitudeProvider } from '~/provider';
import { HelmetProvider } from 'react-helmet-async';
import { Spinner } from '@components';

Sentry.init({
  dsn: 'https://2bed6b35dd70e8068f61a53812a8a5fc@o4509146215284736.ingest.us.sentry.io/4509243214725120',
  sendDefaultPii: true,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const rootElement = document.getElementById('root');

function BootstrapApp() {
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const loadedTheme = await GetTheme();
        setTheme(loadedTheme);
      } catch (err) {
        console.error('Failed to load theme:', err);
      }
    };
    init();
  }, []);

  if (!theme) return <Spinner />;

  return (
    <StrictMode>
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AmplitudeProvider>
              <SentryProvider>
                <AlertProvider>
                  <ErrorBoundary>
                    <App />
                  </ErrorBoundary>
                </AlertProvider>
              </SentryProvider>
            </AmplitudeProvider>
          </ThemeProvider>
        </I18nextProvider>
      </HelmetProvider>
    </StrictMode>
  );
}

if (rootElement) {
  createRoot(rootElement).render(<BootstrapApp />);
} else {
  console.error('Root element not found');
}
