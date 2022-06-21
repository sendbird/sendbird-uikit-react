import './channel-preview.scss';

import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { FileMessage, UserMessage } from '@sendbird/chat/message';

import ChannelAvatar from '../../../../ui/ChannelAvatar';
import Badge from '../../../../ui/Badge';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';

import * as utils from './utils';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import MentionUserLabel from '../../../../ui/MentionUserLabel';
import { useChannelListContext } from '../../context/ChannelListProvider';
import { TypingIndicatorText } from '../../../Channel/components/TypingIndicator';
import MessageStatus from '../../../../ui/MessageStatus';
import { isEditedMessage } from '../../../../utils';

interface ChannelPreviewInterface {
  channel: GroupChannel;
  isActive?: boolean;
  isTyping?: boolean;
  onClick: () => void;
  renderChannelAction: (props: { channel: GroupChannel }) => React.ReactNode;
  tabIndex: number;
}

const ChannelPreview: React.FC<ChannelPreviewInterface> = ({
  channel,
  isActive = false,
  isTyping = false,
  renderChannelAction,
  onClick,
  tabIndex,
}: ChannelPreviewInterface) => {
  const sbState = useSendbirdStateContext();
  const {
    isTypingIndicatorEnabled = false,
    isMessageReceiptStatusEnabled = false,
  } = useChannelListContext();
  const { dateLocale, stringSet } = useLocalization();
  const userId = sbState?.stores?.userStore?.user?.userId;
  const theme = sbState?.config?.theme;
  const isMentionEnabled = sbState?.config?.isMentionEnabled;
  const { isBroadcast, isFrozen } = channel;
  const isChannelTyping = isTypingIndicatorEnabled && isTyping;
  const isMessageStatusEnabled = isMessageReceiptStatusEnabled
    && (channel?.lastMessage?.messageType === 'user' || channel?.lastMessage?.messageType === 'file')
    && channel?.lastMessage?.sender?.userId === userId;
  return (
    <div
      className={[
        'sendbird-channel-preview',
        isActive ? 'sendbird-channel-preview--active' : '',
      ].join(' ')}
      role="link"
      onClick={onClick}
      onKeyPress={onClick}
      tabIndex={tabIndex}
    >
      <div
        className="sendbird-channel-preview__avatar"
      >
        <ChannelAvatar
          channel={channel}
          userId={userId}
          theme={theme}
        />
      </div>
      <div className="sendbird-channel-preview__content">
        <div className="sendbird-channel-preview__content__upper">
          <div className="sendbird-channel-preview__content__upper__header">
            {
              isBroadcast
              && (
                <div className="sendbird-channel-preview__content__upper__header__broadcast-icon">
                  <Icon
                    type={IconTypes.BROADCAST}
                    fillColor={IconColors.SECONDARY}
                    height="16px"
                    width="16px"
                  />
                </div>
              )
            }
            <Label
              className="sendbird-channel-preview__content__upper__header__channel-name"
              type={LabelTypography.SUBTITLE_2}
              color={LabelColors.ONBACKGROUND_1}
            >
              {utils.getChannelTitle(channel, userId, stringSet)}
            </Label>
            <Label
              className="sendbird-channel-preview__content__upper__header__total-members"
              type={LabelTypography.CAPTION_2}
              color={LabelColors.ONBACKGROUND_2}
            >
              {utils.getTotalMembers(channel)}
            </Label>
            {
              isFrozen
              && (
                <div title="Frozen" className="sendbird-channel-preview__content__upper__header__frozen-icon">
                  <Icon
                    type={IconTypes.FREEZE}
                    fillColor={IconColors.PRIMARY}
                    height={12}
                    width={12}
                  />
                </div>
              )
            }
          </div>
          {
            isMessageStatusEnabled
              ? (
                <MessageStatus
                  className="sendbird-channel-preview__content__upper__last-message-at"
                  channel={channel}
                  message={channel?.lastMessage as UserMessage | FileMessage}
                />
              )
              : (
                <Label
                  className="sendbird-channel-preview__content__upper__last-message-at"
                  type={LabelTypography.CAPTION_3}
                  color={LabelColors.ONBACKGROUND_2}
                >
                  {utils.getLastMessageCreatedAt(channel, dateLocale)}
                </Label>
              )
          }
        </div>
        <div className="sendbird-channel-preview__content__lower">
          <Label
            className="sendbird-channel-preview__content__lower__last-message"
            type={LabelTypography.BODY_2}
            color={LabelColors.ONBACKGROUND_3}
          >
            {
              isChannelTyping && (
                <TypingIndicatorText members={channel?.getTypingMembers()} />
              )
            }
            {
              !isChannelTyping && (
                utils.getLastMessage(channel) + (isEditedMessage(channel?.lastMessage as SendBird.UserMessage) ? ` ${stringSet.MESSAGE_EDITED}` : '')
              )
            }
          </Label>
          <div className="sendbird-channel-preview__content__lower__unread-message-count">
            {
              (isMentionEnabled && channel?.unreadMentionCount > 0)
                ? (
                  <MentionUserLabel
                    className="sendbird-channel-preview__content__lower__unread-message-count__mention"
                    color="purple"
                  >
                    {'@'}
                  </MentionUserLabel>
                )
                : null
            }
            {
              utils.getChannelUnreadMessageCount(channel) // return number
                ? <Badge count={utils.getChannelUnreadMessageCount(channel)} />
                : null
            }
          </div>
        </div>
      </div>
      <div
        className="sendbird-channel-preview__action"
      >
        {renderChannelAction({ channel })}
      </div>
    </div>
  );
}

export default ChannelPreview;
