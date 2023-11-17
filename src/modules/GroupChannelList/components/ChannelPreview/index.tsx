import './channel-preview.scss';

import React, { useState } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { FileMessage } from '@sendbird/chat/message';

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
import { CoreMessageType, isVoiceMessage, SendableMessageType } from '../../../../utils';
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
  isActive,
  isTyping,
  renderChannelAction,
  onLeaveChannel,
  onClick,
  tabIndex,
}: ChannelPreviewInterface) => {
  const { config } = useSendbirdStateContext();
  const { theme, isMentionEnabled, userId } = config;
  const { dateLocale, stringSet } = useLocalization();
  const { isMobile } = useMediaQueryContext();
  const {
    activeChannelUrl,
    typingChannelUrls,
    isTypingIndicatorEnabled = false,
    isMessageReceiptStatusEnabled = false,
  } = useChannelListContext();
  const isActiveChannel = isActive || (channel?.url === activeChannelUrl);
  const isTypingChannel = (isTyping || (typingChannelUrls.includes(channel.url))) && isTypingIndicatorEnabled;

  const [showMobileLeave, setShowMobileLeave] = useState(false);
  const isMessageStatusEnabled = isMessageReceiptStatusEnabled
    && (!channel?.lastMessage?.isAdminMessage())
    && (channel?.lastMessage as SendableMessageType)?.sender?.userId === userId;

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
          isActiveChannel ? 'sendbird-channel-preview--active' : '',
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
                (channel?.isBroadcast || false)
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
                {channelName}
              </Label>
              <Label
                className="sendbird-channel-preview__content__upper__header__total-members"
                type={LabelTypography.CAPTION_2}
                color={LabelColors.ONBACKGROUND_2}
              >
                {utils.getTotalMembers(channel)}
              </Label>
              {
                (channel?.isFrozen || false)
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
              (!channel?.isEphemeral && isMessageStatusEnabled) && (
                <MessageStatus
                  className="sendbird-channel-preview__content__upper__last-message-at"
                  channel={channel}
                  message={channel?.lastMessage as CoreMessageType}
                  isDateSeparatorConsidered={false}
                />
              )
            }
            {
              (!channel?.isEphemeral && !isMessageStatusEnabled) && (
                <Label
                  className="sendbird-channel-preview__content__upper__last-message-at"
                  type={LabelTypography.CAPTION_3}
                  color={LabelColors.ONBACKGROUND_2}
                >
                  {utils.getLastMessageCreatedAt({
                    channel,
                    locale: dateLocale,
                    stringSet,
                  })}
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
                isTypingChannel && (
                  <TypingIndicatorText members={channel?.getTypingUsers()} />
                )
              }
              {
                !isTypingChannel && !isVoiceMessage(channel?.lastMessage as FileMessage) && (
                  utils.getLastMessage(channel, stringSet)
                )
              }
              {
                !isTypingChannel && isVoiceMessage(channel?.lastMessage as FileMessage) && (
                  stringSet.VOICE_MESSAGE
                )
              }
            </Label>
            {
              !channel?.isEphemeral && (
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
              )
            }
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
};

export default ChannelPreview;
