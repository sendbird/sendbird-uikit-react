import './index.scss';
import React from 'react';
import { GroupChannelUIBasicProps } from '../GroupChannelUI/GroupChannelUIView';
export interface GroupChannelMessageListProps {
    className?: string;
    /**
     * A function that customizes the rendering of each message component in the message list component.
     */
    renderMessage?: GroupChannelUIBasicProps['renderMessage'];
    /**
     * A function that customizes the rendering of the content portion of each message component.
     */
    renderMessageContent?: GroupChannelUIBasicProps['renderMessageContent'];
    /**
     * A function that customizes the rendering of a separator component between messages.
     */
    renderCustomSeparator?: GroupChannelUIBasicProps['renderCustomSeparator'];
    /**
     * A function that customizes the rendering of a loading placeholder component.
     */
    renderPlaceholderLoader?: GroupChannelUIBasicProps['renderPlaceholderLoader'];
    /**
     * A function that customizes the rendering of an empty placeholder component when there are no messages in the channel.
     */
    renderPlaceholderEmpty?: GroupChannelUIBasicProps['renderPlaceholderEmpty'];
    /**
     * A function that customizes the rendering of a frozen notification component when the channel is frozen.
     */
    renderFrozenNotification?: GroupChannelUIBasicProps['renderFrozenNotification'];
}
export declare const MessageList: ({ className, renderMessage, renderMessageContent, renderCustomSeparator, renderPlaceholderLoader, renderPlaceholderEmpty, renderFrozenNotification, }: GroupChannelMessageListProps) => React.JSX.Element;
export default MessageList;
