import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';
import { CharacterPayload, CharacterPayloadSchema } from '@shared-types';

type AmplitudeContextType = {
  amplitude: typeof amplitude;
  trackCharacterCreated: (character: CharacterPayload, result?: { char_uuid?: string }) => void;
  trackCharacterUpdated: (character: CharacterPayload, result?: { char_uuid?: string }) => void;
  trackCharacterDrafted: (character: CharacterPayload, creatorUuid?: string) => void;
  trackCharacterCreationFailed: (character: CharacterPayload, error: string) => void;
  trackCharacterUpdateFailed: (character: CharacterPayload, error: string) => void;
  trackCharacterDraftFailed: (character: CharacterPayload, error: string) => void;
};

const AmplitudeContext = createContext<AmplitudeContextType | undefined>(undefined);

interface AmplitudeProviderProps {
  children: ReactNode;
  apiKey?: string;
  options?: {
    autocapture?: boolean;
    sampleRate?: number;
  };
}

export function AmplitudeProvider({ 
  children, 
  apiKey = '408a394190372749f2a9e6157f91f981',
  options = { autocapture: true, sampleRate: 1 }
}: AmplitudeProviderProps) {
  useEffect(() => {
    if (!amplitude.getDeviceId()) {
      amplitude.add(sessionReplayPlugin({ sampleRate: options.sampleRate }));
      amplitude.init(apiKey, { autocapture: options.autocapture });
    }
  }, [apiKey, options.autocapture, options.sampleRate]);

  const validatePayload = (character: CharacterPayload): CharacterPayload => {
    const parsed = CharacterPayloadSchema.safeParse(character);
    if (!parsed.success) {
      console.warn('Invalid CharacterPayload', parsed.error);
      return character; 
    }
    return parsed.data;
  };

  const trackCharacterCreated = (character: CharacterPayload, result?: { char_uuid?: string }) => {
    amplitude.track('Character Created', {
      ...validatePayload(character),
      character_uuid: result?.char_uuid ?? character.char_uuid,
    });
  };

  const trackCharacterUpdated = (character: CharacterPayload, result?: { char_uuid?: string }) => {
    amplitude.track('Character Updated', {
      ...validatePayload(character),
      character_uuid: result?.char_uuid ?? character.char_uuid,
    });
  };

  const trackCharacterDrafted = (character: CharacterPayload, creatorUuid?: string) => {
    amplitude.track('Character Drafted', {
      ...validatePayload(character),
      creator_uuid: creatorUuid ?? character.creator,
    });
  };

  const trackCharacterCreationFailed = (character: CharacterPayload, error: string) => {
    amplitude.track('Character Creation Failed', {
      ...validatePayload(character),
      error_message: error,
    });
  };

  const trackCharacterUpdateFailed = (character: CharacterPayload, error: string) => {
    amplitude.track('Character Update Failed', {
      ...validatePayload(character),
      error_message: error,
    });
  };

  const trackCharacterDraftFailed = (character: CharacterPayload, error: string) => {
    amplitude.track('Character Draft Failed', {
      ...validatePayload(character),
      error_message: error,
    });
  };

  return (
    <AmplitudeContext.Provider value={{ 
      amplitude,
      trackCharacterCreated,
      trackCharacterUpdated,
      trackCharacterDrafted,
      trackCharacterCreationFailed,
      trackCharacterUpdateFailed,
      trackCharacterDraftFailed,
    }}>
      {children}
    </AmplitudeContext.Provider>
  );
}

export function useAmplitude() {
  const context = useContext(AmplitudeContext);
  if (!context) {
    throw new Error('useAmplitude must be used within an AmplitudeProvider');
  }
  return context.amplitude;
}

export function useAmplitudeTracking() {
  const context = useContext(AmplitudeContext);
  if (!context) {
    throw new Error('useAmplitudeTracking must be used within an AmplitudeProvider');
  }
  return {
    trackCharacterCreated: context.trackCharacterCreated,
    trackCharacterUpdated: context.trackCharacterUpdated,
    trackCharacterDrafted: context.trackCharacterDrafted,
    trackCharacterCreationFailed: context.trackCharacterCreationFailed,
    trackCharacterUpdateFailed: context.trackCharacterUpdateFailed,
    trackCharacterDraftFailed: context.trackCharacterDraftFailed,
  };
}
