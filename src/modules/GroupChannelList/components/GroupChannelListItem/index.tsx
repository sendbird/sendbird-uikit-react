import './channel-preview.scss';

import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import type { SendableMessageType } from '../../../../utils';

import * as utils from './utils';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useGroupChannelListContext } from '../../context/GroupChannelListProvider';
import { GroupChannelListItemView } from './GroupChannelListItemView';

interface GroupChannelListItemInterface extends React.PropsWithChildren {
  channel: GroupChannel;
  isSelected?: boolean;
  isTyping?: boolean;
  onClick: () => void;
  onLeaveChannel?: () => void;
  renderChannelAction: (props: { channel: GroupChannel }) => React.ReactElement;
  tabIndex: number;
}

export const GroupChannelListItem = ({
  channel,
  isSelected,
  isTyping,
  renderChannelAction,
  onLeaveChannel,
  onClick,
  tabIndex,
}: GroupChannelListItemInterface) => {
  const { config } = useSendbirdStateContext();
  const { userId } = config;
  const { stringSet } = useLocalization();
  const {
    selectedChannelUrl,
    typingChannelUrls,
    isTypingIndicatorEnabled = false,
    isMessageReceiptStatusEnabled = false,
  } = useGroupChannelListContext();
  const isSelectedChannel = isSelected || (channel?.url === selectedChannelUrl);
  const isTypingChannel = (isTyping || (typingChannelUrls.includes(channel.url))) && isTypingIndicatorEnabled;
  const isMessageStatusEnabled = isMessageReceiptStatusEnabled
    && (!channel?.lastMessage?.isAdminMessage())
    && (channel?.lastMessage as SendableMessageType)?.sender?.userId === userId;

  const channelName = utils.getChannelTitle(channel, userId, stringSet);
  return (
    <GroupChannelListItemView
      channel={channel}
      tabIndex={tabIndex}
      channelName={channelName}
      isTyping={isTypingChannel}
      isSelected={isSelectedChannel}
      isMessageStatusEnabled={isMessageStatusEnabled}
      onClick={onClick}
      onLeaveChannel={onLeaveChannel}
      renderChannelAction={renderChannelAction}
    />
  );
};

export { GroupChannelListItemView, GroupChannelListItemViewProps } from './GroupChannelListItemView';
