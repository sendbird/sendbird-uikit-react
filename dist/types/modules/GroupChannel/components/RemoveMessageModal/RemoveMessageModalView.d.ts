import React from 'react';
import { EveryMessage } from '../../../../types';
import { SendableMessageType } from '../../../../utils';
export interface RemoveMessageModalProps {
    onSubmit?: () => void;
    onCancel: () => void;
    message: EveryMessage;
}
export interface RemoveMessageModalViewProps extends RemoveMessageModalProps {
    deleteMessage: (message: SendableMessageType) => Promise<void>;
}
export declare const RemoveMessageModalView: (props: RemoveMessageModalViewProps) => React.JSX.Element;
export default RemoveMessageModalView;
