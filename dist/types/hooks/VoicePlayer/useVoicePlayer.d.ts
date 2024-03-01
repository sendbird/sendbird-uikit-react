import { VoicePlayerStatusType } from './dux/initialState';
export interface UseVoicePlayerProps {
    key: string;
    channelUrl: string;
    audioFile?: File;
    audioFileUrl?: string;
}
export interface UseVoicePlayerContext {
    play: () => void;
    pause: () => void;
    stop: (text?: string) => void;
    playbackTime: number;
    duration: number;
    playingStatus: VoicePlayerStatusType;
}
export declare const useVoicePlayer: ({ key, channelUrl, audioFile, audioFileUrl, }: UseVoicePlayerProps) => UseVoicePlayerContext;
