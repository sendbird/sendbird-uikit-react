import React from 'react';

import type { SendableMessageType } from '../../../../utils';

import * as utils from './utils';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { GroupChannelListItemBasicProps, GroupChannelListItemView } from './GroupChannelListItemView';
import { useGroupChannelList } from '../../context/useGroupChannelList';
import { useSendbird } from '../../../../lib/Sendbird/context/hooks/useSendbird';

export interface GroupChannelListItemProps extends GroupChannelListItemBasicProps {}

export const GroupChannelListItem = ({
  channel,
  isSelected,
  isTyping,
  renderChannelAction,
  onLeaveChannel,
  onClick,
  tabIndex,
}: GroupChannelListItemProps) => {
  const { state: { config } } = useSendbird();
  const { stringSet } = useLocalization();
  const {
    state: {
      isTypingIndicatorEnabled = false,
      isMessageReceiptStatusEnabled = false,
    },
  } = useGroupChannelList();

  const userId = config.userId;
  const isMessageStatusEnabled = isMessageReceiptStatusEnabled
      && (!channel.lastMessage?.isAdminMessage())
      && (channel.lastMessage as SendableMessageType)?.sender?.userId === userId;

  return (
    <GroupChannelListItemView
      channel={channel}
      tabIndex={tabIndex}
      channelName={utils.getChannelTitle(channel, userId, stringSet)}
      isTyping={isTypingIndicatorEnabled && isTyping}
      isSelected={isSelected}
      isMessageStatusEnabled={isMessageStatusEnabled}
      onClick={onClick}
      onLeaveChannel={onLeaveChannel}
      renderChannelAction={renderChannelAction}
    />
  );
};
