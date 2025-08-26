import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

type AmplitudeContextType = {
  amplitude: typeof amplitude;
};

const AmplitudeContext = createContext<AmplitudeContextType | undefined>(undefined);

export const useAmplitude = () => {
  const context = useContext(AmplitudeContext);
  if (!context) {
    throw new Error('useAmplitude must be used within an AmplitudeProvider');
  }
  return context.amplitude;
};

interface AmplitudeProviderProps {
  children: ReactNode;
  apiKey?: string;
  options?: {
    autocapture?: boolean;
    sampleRate?: number;
  };
}

export const AmplitudeProvider = ({ 
  children, 
  apiKey = '408a394190372749f2a9e6157f91f981',
  options = { autocapture: true, sampleRate: 1 }
}: AmplitudeProviderProps) => {
  useEffect(() => {
    if (!amplitude.getDeviceId()) {
      amplitude.add(sessionReplayPlugin({ sampleRate: options.sampleRate }));
      amplitude.init(apiKey, { autocapture: options.autocapture });
    }
  }, [apiKey, options.autocapture, options.sampleRate]);

  return (
    <AmplitudeContext.Provider value={{ amplitude }}>
      {children}
    </AmplitudeContext.Provider>
  );
};
