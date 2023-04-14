import React from 'react';
import { VoicePlayerProvider } from '../hooks/VoicePlayer';
import { VoiceRecorderProvider } from '../hooks/VoiceRecorder';

export interface VoiceMessageProviderProps {
  isVoiceMessageEnabled?: boolean;
  children?: React.ReactElement;
}

export const VoiceMessageProvider = ({
  isVoiceMessageEnabled = true,
  children,
}: VoiceMessageProviderProps): React.ReactElement => {
  if (!isVoiceMessageEnabled) {
    return (
      <VoicePlayerProvider>
        {children}
      </VoicePlayerProvider>
    );
  }
  return (
    <VoiceRecorderProvider>
      <VoicePlayerProvider>
        {children}
      </VoicePlayerProvider>
    </VoiceRecorderProvider>
  );
};

export default VoiceMessageProvider;
