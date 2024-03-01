import './voice-message-wrapper.scss';
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
export interface VoiceMessageInputWrapperProps {
    channel?: GroupChannel;
    onCancelClick?: () => void;
    onSubmitClick?: (file: File, duration: number) => void;
}
export declare const VoiceMessageInputWrapper: ({ channel, onCancelClick, onSubmitClick, }: VoiceMessageInputWrapperProps) => React.ReactElement;
export default VoiceMessageInputWrapper;
