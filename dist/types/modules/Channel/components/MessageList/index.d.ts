import '../../../GroupChannel/components/MessageList/index.scss';
import React from 'react';
import { GroupChannelMessageListProps } from '../../../GroupChannel/components/MessageList';
import { GroupChannelUIBasicProps } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';
export interface MessageListProps extends GroupChannelMessageListProps {
    /**
     * Customizes all child components of the message component.
     * */
    renderMessage?: GroupChannelUIBasicProps['renderMessage'];
}
export declare const MessageList: ({ className, renderMessage, renderMessageContent, renderCustomSeparator, renderPlaceholderLoader, renderPlaceholderEmpty, renderFrozenNotification, }: MessageListProps) => React.JSX.Element;
export default MessageList;
