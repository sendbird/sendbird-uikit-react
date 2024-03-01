import React from 'react';
import './index.scss';
import { ClientSentMessages } from '../../../../types';
export interface MessageSearchUIProps {
    renderPlaceHolderError?: (props: void) => React.ReactElement;
    renderPlaceHolderLoading?: (props: void) => React.ReactElement;
    renderPlaceHolderNoString?: (props: void) => React.ReactElement;
    renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
    renderSearchItem?({ message, onResultClick, }: {
        message: ClientSentMessages;
        onResultClick?: (message: ClientSentMessages) => void;
    }): JSX.Element;
}
export declare const MessageSearchUI: React.FC<MessageSearchUIProps>;
export default MessageSearchUI;
