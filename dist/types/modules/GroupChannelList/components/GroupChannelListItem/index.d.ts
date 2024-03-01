import React from 'react';
import { GroupChannelListItemBasicProps } from './GroupChannelListItemView';
export interface GroupChannelListItemProps extends GroupChannelListItemBasicProps {
}
export declare const GroupChannelListItem: ({ channel, isSelected, isTyping, renderChannelAction, onLeaveChannel, onClick, tabIndex, }: GroupChannelListItemProps) => React.JSX.Element;
