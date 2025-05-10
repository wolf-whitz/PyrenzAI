import React, { useEffect, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface SentryProviderProps {
  children: ReactNode;
}

export default function SentryProvider({ children }: SentryProviderProps) {
  useEffect(() => {
    Sentry.init({
      dsn: 'https://2bed6b35dd70e8068f61a53812a8a5fc@o4509146215284736.ingest.us.sentry.io/4509243214725120',
      sendDefaultPii: true,
      integrations: [
        Sentry.replayIntegration()
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0
    });
  }, []);

  return (
    <Sentry.ErrorBoundary>
      {children}
    </Sentry.ErrorBoundary>
  );
}
