import React from 'react';
import { SendableMessageType } from '../../../utils';
export interface RemoveMessageProps {
    onCancel: () => void;
    onSubmit?: () => void;
    message: SendableMessageType;
}
declare const RemoveMessage: React.FC<RemoveMessageProps>;
export default RemoveMessage;
