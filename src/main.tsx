import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './GlobalStyles.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { ThemeProvider, CssBaseline, Box, Fade } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import { GetTheme } from '~/theme';
import i18n from '~/provider/TranslationProvider.ts';
import { SentryProvider } from './provider/SentryProvider';
import * as Sentry from '@sentry/react';

import ErrorBoundary from './routes/ErrorBoundary';
import { DeviceTest } from '~/Utility/DeviceTest';

import { AlertProvider } from '~/provider';

const theme = GetTheme();
const currentTheme = theme.palette.mode;


Sentry.init({
  dsn: 'https://2bed6b35dd70e8068f61a53812a8a5fc@o4509146215284736.ingest.us.sentry.io/4509243214725120',
  sendDefaultPii: true,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

DeviceTest();

const Main = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fade in={show} timeout={600}>
      <Box
        data-mui-theme={`theme-${currentTheme}`}
        aria-label="PyrenzAI"
        sx={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'thin',
          scrollbarColor: 'transparent transparent',
          '&::-webkit-scrollbar': {
            width: 8,
            opacity: 0.2,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::-webkit-scrollbar': {
            opacity: 1,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(100, 100, 100, 0.4)',
            borderRadius: 10,
            border: '2px solid transparent',
            backgroundClip: 'content-box',
          },
        }}
      >
        <App />
      </Box>
    </Fade>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SentryProvider>
          <AlertProvider>
            <ErrorBoundary>
              <Main />
            </ErrorBoundary>
          </AlertProvider>
        </SentryProvider>
        <Analytics />
        <SpeedInsights />
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>
);
