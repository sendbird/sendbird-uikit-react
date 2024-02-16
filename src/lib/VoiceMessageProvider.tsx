import React from 'react';
import { VoicePlayerProvider } from '../hooks/VoicePlayer';
import { VoiceRecorderProvider } from '../hooks/VoiceRecorder';

export interface VoiceMessageProviderProps {
  children: React.ReactElement;
}

export const VoiceMessageProvider = ({ children }: VoiceMessageProviderProps): React.ReactElement => {
  return (
    <VoicePlayerProvider>
      <VoiceRecorderProvider>{children}</VoiceRecorderProvider>
    </VoicePlayerProvider>
  );
};

export default VoiceMessageProvider;
