import React from 'react';
import { VoicePlayerProvider } from '../hooks/VoicePlayer';
import { VoiceRecorderProvider } from '../hooks/VoiceRecorder';

export interface VoiceMessageProviderProps {
  children: React.ReactElement;
  isVoiceMessageEnabled?: boolean;
}

export const VoiceMessageProvider = ({
  children,
  isVoiceMessageEnabled = true,
}: VoiceMessageProviderProps): React.ReactElement => {
  if (isVoiceMessageEnabled) {
    return (
      <VoiceRecorderProvider>
        <VoicePlayerProvider>
          {children}
        </VoicePlayerProvider>
      </VoiceRecorderProvider>
    );
  }
  return (
    <VoicePlayerProvider>
      {children}
    </VoicePlayerProvider>
  );
};

export default VoiceMessageProvider;
