import React, { useEffect, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface SentryProviderProps {
  children: ReactNode;
}

export function SentryProvider({ children }: SentryProviderProps) {
  return <Sentry.ErrorBoundary>{children}</Sentry.ErrorBoundary>;
}
