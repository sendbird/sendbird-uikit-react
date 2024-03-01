import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
export interface GroupChannelPreviewActionProps {
    channel?: GroupChannel;
    disabled?: boolean;
    onLeaveChannel?: () => Promise<void>;
}
export declare function GroupChannelPreviewAction({ channel, disabled, onLeaveChannel }: GroupChannelPreviewActionProps): React.JSX.Element;
export default GroupChannelPreviewAction;
