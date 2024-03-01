import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelListItemBasicProps } from '../../../GroupChannelList/components/GroupChannelListItem/GroupChannelListItemView';
interface ChannelPreviewProps extends Omit<GroupChannelListItemBasicProps, 'onLeaveChannel'> {
    onLeaveChannel(channel?: GroupChannel, onLeaveChannelCb?: (channel: GroupChannel, error?: null) => void): Promise<void>;
}
export interface ChannelListUIProps {
    renderChannelPreview?: (props: ChannelPreviewProps) => React.ReactElement;
    renderHeader?: (props: void) => React.ReactElement;
    renderPlaceHolderError?: (props: void) => React.ReactElement;
    renderPlaceHolderLoading?: (props: void) => React.ReactElement;
    renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
}
declare const ChannelListUI: React.FC<ChannelListUIProps>;
export default ChannelListUI;
