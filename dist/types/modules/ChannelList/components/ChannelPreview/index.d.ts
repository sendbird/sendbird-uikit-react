import React from 'react';
import { GroupChannelListItemBasicProps } from '../../../GroupChannelList/components/GroupChannelListItem/GroupChannelListItemView';
interface ChannelPreviewInterface extends GroupChannelListItemBasicProps {
    /** @deprecated Please use `isSelected` instead */
    isActive?: boolean;
}
declare const ChannelPreview: ({ channel, isActive, isSelected, isTyping, renderChannelAction, onLeaveChannel, onClick, tabIndex, }: ChannelPreviewInterface) => React.JSX.Element;
export default ChannelPreview;
