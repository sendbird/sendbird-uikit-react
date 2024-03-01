import './index.scss';
import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelPreviewActionProps } from '../GroupChannelPreviewAction';
export interface GroupChannelListItemBasicProps {
    tabIndex: number;
    channel: GroupChannel;
    onClick: () => void;
    renderChannelAction: (props: GroupChannelPreviewActionProps) => React.ReactElement;
    isSelected?: boolean;
    isTyping?: boolean;
    onLeaveChannel?: () => Promise<void>;
}
export interface GroupChannelListItemViewProps extends GroupChannelListItemBasicProps {
    channelName: string;
    isMessageStatusEnabled?: boolean;
}
export declare const GroupChannelListItemView: ({ channel, tabIndex, isTyping, isSelected, channelName, isMessageStatusEnabled, onClick, onLeaveChannel, renderChannelAction, }: GroupChannelListItemViewProps) => React.JSX.Element;
