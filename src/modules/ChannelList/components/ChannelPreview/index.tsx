import React from 'react';

import { SendableMessageType } from '../../../../utils';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useChannelListContext } from '../../context/ChannelListProvider';
import { getChannelTitle } from './utils';
import { GroupChannelListItemBasicProps, GroupChannelListItemView } from '../../../GroupChannelList/components/GroupChannelListItem/GroupChannelListItemView';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

interface ChannelPreviewInterface extends GroupChannelListItemBasicProps {
  /** @deprecated Please use `isSelected` instead */
  isActive?: boolean;
}

/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
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
  const { state } = useSendbird();
  const { config } = state;
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
