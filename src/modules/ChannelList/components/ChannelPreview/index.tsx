import './channel-preview.scss';

import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import { SendableMessageType } from '../../../../utils';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useChannelListContext } from '../../context/ChannelListProvider';
import { GroupChannelListItemView } from '../../../GroupChannelList/components/GroupChannelListItem';
import { getChannelTitle } from './utils';

interface ChannelPreviewInterface {
  channel: GroupChannel;
  isActive?: boolean;
  isTyping?: boolean;
  onClick: () => void;
  onLeaveChannel?: () => void;
  renderChannelAction: (props: { channel: GroupChannel }) => React.ReactElement;
  tabIndex: number;
}

const ChannelPreview: React.FC<ChannelPreviewInterface> = ({
  channel,
  isActive = false,
  isTyping = false,
  renderChannelAction,
  onLeaveChannel,
  onClick,
  tabIndex,
}: ChannelPreviewInterface) => {
  const sbState = useSendbirdStateContext();
  const {
    isTypingIndicatorEnabled = false,
    isMessageReceiptStatusEnabled = false,
  } = useChannelListContext();
  const { stringSet } = useLocalization();

  const userId = sbState?.stores?.userStore?.user?.userId;
  const isMessageStatusEnabled = isMessageReceiptStatusEnabled
    && (channel?.lastMessage?.messageType === 'user' || channel?.lastMessage?.messageType === 'file')
    && (channel?.lastMessage as SendableMessageType)?.sender?.userId === userId;

  const channelName = getChannelTitle(channel, userId, stringSet);
  return (
    <GroupChannelListItemView
      channel={channel}
      tabIndex={tabIndex}
      isTyping={isTypingIndicatorEnabled && isTyping}
      isSelected={isActive}
      channelName={channelName}
      isMessageStatusEnabled={isMessageStatusEnabled}
      onClick={onClick}
      onLeaveChannel={onLeaveChannel}
      renderChannelAction={renderChannelAction}
    />
  );
};

export default ChannelPreview;
