import './channel-preview.scss';

import React, { useState } from 'react';
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
import Modal from '../../../../ui/Modal';
import TextButton from '../../../../ui/TextButton';
import { useChannelListContext } from '../../context/ChannelListProvider';
import { TypingIndicatorText } from '../../../Channel/components/TypingIndicator';
import MessageStatus from '../../../../ui/MessageStatus';
import { isEditedMessage } from '../../../../utils';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import useLongPress from '../../../../hooks/useLongPress';

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
  const { dateLocale, stringSet } = useLocalization();
  const { isMobile } = useMediaQueryContext();

  const [showMobileLeave, setShowMobileLeave] = useState(false);

  const userId = sbState?.stores?.userStore?.user?.userId;
  const theme = sbState?.config?.theme;
  const isMentionEnabled = sbState?.config?.isMentionEnabled;
  const isFrozen = channel?.isFrozen || false;
  const isBroadcast = channel?.isBroadcast || false;
  const isChannelTyping = isTypingIndicatorEnabled && isTyping;
  const isMessageStatusEnabled = isMessageReceiptStatusEnabled
    && (channel?.lastMessage?.messageType === 'user' || channel?.lastMessage?.messageType === 'file')
    && (channel?.lastMessage as UserMessage | FileMessage)?.sender?.userId === userId;

  const onLongPress = useLongPress({
    onLongPress: () => {
      if (isMobile) {
        setShowMobileLeave(true);
      }
    },
    onClick,
  }, {
    delay: 1000,
  });
  const channelName = utils.getChannelTitle(channel, userId, stringSet);
  return (
    <>
      <div
        className={[
          'sendbird-channel-preview',
          isActive ? 'sendbird-channel-preview--active' : '',
        ].join(' ')}
        role="link"
        tabIndex={tabIndex}
        {...(isMobile ? { ...onLongPress } : { onClick })}
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
                <div>
                  { channelName }
                </div>
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
                    isDateSeparatorConsidered={false}
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
                  <TypingIndicatorText members={channel?.getTypingUsers()} />
                )
              }
              {
                !isChannelTyping && (
                  utils.getLastMessage(channel) + (isEditedMessage(channel?.lastMessage as UserMessage | FileMessage) ? ` ${stringSet.MESSAGE_EDITED}` : '')
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
        {
          !isMobile && (
            <div
              className="sendbird-channel-preview__action"
            >
              {renderChannelAction({ channel })}
            </div>
          )
        }
      </div>
      {/*
        Event from portal is transferred to parent
        If this modal goes inside channel preview, it will propogate event to
        ChannelPreview and cause many issues with click/touchEnd etc
        https://github.com/facebook/react/issues/11387#issuecomment-340019419
      */}
      {
        showMobileLeave && isMobile && (
          <Modal
            className="sendbird-channel-preview__leave--mobile"
            titleText={channelName}
            hideFooter
            isCloseOnClickOutside
            onCancel={() => setShowMobileLeave(false)}
          >
            <TextButton
              onClick={() => {
                onLeaveChannel();
                setShowMobileLeave(false);
              }}
              className="sendbird-channel-preview__leave-label--mobile"
            >
              <Label
                type={LabelTypography.SUBTITLE_1}
                color={LabelColors.ONBACKGROUND_1}
              >
                {stringSet.CHANNEL_PREVIEW_MOBILE_LEAVE}
              </Label>
            </TextButton>
          </Modal>
        )
      }
    </>
  );
}

export default ChannelPreview;
