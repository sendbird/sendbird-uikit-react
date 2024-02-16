import React from 'react';

import { SendableMessageType } from '../../../../utils';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useChannelListContext } from '../../context/ChannelListProvider';
import { getChannelTitle } from './utils';
import { GroupChannelListItemBasicProps, GroupChannelListItemView } from '../../../GroupChannelList/components/GroupChannelListItem/GroupChannelListItemView';

interface ChannelPreviewInterface extends GroupChannelListItemBasicProps {
  /** @deprecated Please use `isSelected` instead */
  isActive?: boolean;
}

const ChannelPreview = ({
  channel,
  isActive = false,
  isSelected = false,
  isTyping = false,
  renderChannelAction,
  onLeaveChannel,
  onClick,
  tabIndex,
}: ChannelPreviewInterface) => {
  const { config } = useSendbirdStateContext();
  const { stringSet } = useLocalization();
  const { isTypingIndicatorEnabled = false, isMessageReceiptStatusEnabled = false } = useChannelListContext();

  const userId = config.userId;
  const isMessageStatusEnabled = isMessageReceiptStatusEnabled
      && (channel?.lastMessage?.messageType === 'user' || channel?.lastMessage?.messageType === 'file')
      && (channel?.lastMessage as SendableMessageType)?.sender?.userId === userId;

  return (
    <GroupChannelListItemView
      channel={channel}
      tabIndex={tabIndex}
      isTyping={isTypingIndicatorEnabled && isTyping}
      isSelected={isSelected ?? isActive}
      channelName={getChannelTitle(channel, userId, stringSet)}
      isMessageStatusEnabled={isMessageStatusEnabled}
      onClick={onClick}
      onLeaveChannel={onLeaveChannel}
      renderChannelAction={renderChannelAction}
    />
  );
};

export default ChannelPreview;
