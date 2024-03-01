import { VoiceRecorderEventHandler } from '.';
export declare const VoiceRecorderStatus: {
    readonly PREPARING: "PREPARING";
    readonly READY_TO_RECORD: "READY_TO_RECORD";
    readonly RECORDING: "RECORDING";
    readonly COMPLETED: "COMPLETED";
};
export type VoiceRecorderStatus = typeof VoiceRecorderStatus[keyof typeof VoiceRecorderStatus];
export interface UseVoiceRecorderContext {
    start: () => void;
    stop: () => void;
    cancel: () => void;
    recordingLimit: number;
    recordingTime: number;
    recordedFile: File;
    recordingStatus: VoiceRecorderStatus;
}
export declare const useVoiceRecorder: ({ onRecordingStarted, onRecordingEnded, }: VoiceRecorderEventHandler) => UseVoiceRecorderContext;
