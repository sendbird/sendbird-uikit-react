import React from 'react';
import { VoicePlayerInitialState } from './dux/initialState';
export interface VoicePlayerProps {
    children: React.ReactElement;
}
export interface VoicePlayerPlayProps {
    groupKey: string;
    audioFile?: File;
    audioFileUrl?: string;
}
export interface VoicePlayerContext {
    play: (props: VoicePlayerPlayProps) => void;
    pause: (groupKey?: string) => void;
    stop: (text?: string) => void;
    voicePlayerStore: VoicePlayerInitialState;
}
export declare const ALL = "ALL";
export declare const VoicePlayerProvider: ({ children, }: VoicePlayerProps) => React.ReactElement;
export declare const useVoicePlayerContext: () => VoicePlayerContext;
