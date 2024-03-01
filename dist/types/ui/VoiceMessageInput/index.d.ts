import React from 'react';
import './index.scss';
import { VoiceMessageInputStatus } from './types';
export interface VoiceMessageInputProps {
    minRecordTime?: number;
    maximumValue: number;
    currentValue?: number;
    currentType: VoiceMessageInputStatus;
    onCancelClick?: () => void;
    onControlClick?: (type: VoiceMessageInputStatus) => void;
    onSubmitClick?: () => void;
    renderCancelButton?: () => React.ReactElement;
    renderControlButton?: (type: VoiceMessageInputStatus) => React.ReactElement;
    renderSubmitButton?: () => React.ReactElement;
}
export declare const VoiceMessageInput: ({ minRecordTime, maximumValue, currentValue, currentType, onCancelClick, onControlClick, onSubmitClick, renderCancelButton, renderControlButton, renderSubmitButton, }: VoiceMessageInputProps) => React.ReactElement;
