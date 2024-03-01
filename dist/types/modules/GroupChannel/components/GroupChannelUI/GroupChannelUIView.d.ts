import './index.scss';
import React from 'react';
import type { RenderCustomSeparatorProps, RenderMessageParamsType } from '../../../../types';
import type { GroupChannelHeaderProps } from '../GroupChannelHeader';
import type { GroupChannelMessageListProps } from '../MessageList';
import type { MessageContentProps } from '../../../../ui/MessageContent';
export interface GroupChannelUIBasicProps {
    /**
     * A function that customizes the rendering of a loading placeholder component.
     */
    renderPlaceholderLoader?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of a invalid placeholder component.
     */
    renderPlaceholderInvalid?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of an empty placeholder component when there are no messages in the channel.
     */
    renderPlaceholderEmpty?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of a header component.
     */
    renderChannelHeader?: (props: GroupChannelHeaderProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of a message list component.
     */
    renderMessageList?: (props: GroupChannelMessageListProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of a message input component.
     */
    renderMessageInput?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of each message component in the message list component.
     */
    renderMessage?: (props: RenderMessageParamsType) => React.ReactElement;
    /**
     * A function that customizes the rendering of the content portion of each message component.
     */
    renderMessageContent?: (props: MessageContentProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of a separator component between messages.
     */
    renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of a frozen notification component when the channel is frozen.
     */
    renderFrozenNotification?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of the file upload icon in the message input component.
     */
    renderFileUploadIcon?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of the voice message icon in the message input component.
     */
    renderVoiceMessageIcon?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of the send message icon in the message input component.
     */
    renderSendMessageIcon?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of the typing indicator component.
     */
    renderTypingIndicator?: () => React.ReactElement;
}
export interface GroupChannelUIViewProps extends GroupChannelUIBasicProps {
    isLoading?: boolean;
    isInvalid: boolean;
    channelUrl: string;
    renderChannelHeader: GroupChannelUIBasicProps['renderChannelHeader'];
    renderMessageList: GroupChannelUIBasicProps['renderMessageList'];
    renderMessageInput: GroupChannelUIBasicProps['renderMessageInput'];
}
export declare const GroupChannelUIView: (props: GroupChannelUIViewProps) => React.JSX.Element;
