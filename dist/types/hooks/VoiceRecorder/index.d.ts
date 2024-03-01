import React from 'react';
export interface VoiceRecorderProps {
    children: React.ReactElement;
}
export interface VoiceRecorderEventHandler {
    onRecordingStarted?: () => void;
    onRecordingEnded?: (props: null | File) => void;
}
export interface VoiceRecorderContext {
    start: (eventHandler?: VoiceRecorderEventHandler) => void;
    stop: () => void;
    isRecordable: boolean;
}
export declare const VoiceRecorderProvider: (props: VoiceRecorderProps) => React.ReactElement;
export declare const useVoiceRecorderContext: () => VoiceRecorderContext;
declare const _default: {
    VoiceRecorderProvider: (props: VoiceRecorderProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    useVoiceRecorderContext: () => VoiceRecorderContext;
};
export default _default;
