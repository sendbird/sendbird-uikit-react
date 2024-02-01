import React, { useState } from 'react';

import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { FileMessage } from '@sendbird/chat/message';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import useLongPress from '../../../../hooks/useLongPress';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import { noop } from '../../../../utils/utils';
import { CoreMessageType, isVoiceMessage } from '../../../../utils';
import {
  getChannelUnreadMessageCount,
  getLastMessage,
  getLastMessageCreatedAt,
  getTotalMembers,
} from './utils';

import { TypingIndicatorText } from '../../../GroupChannel/components/TypingIndicator';

import Badge from '../../../../ui/Badge';
import ChannelAvatar from '../../../../ui/ChannelAvatar';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import MentionUserLabel from '../../../../ui/MentionUserLabel';
import MessageStatus from '../../../../ui/MessageStatus';
import Modal from '../../../../ui/Modal';
import TextButton from '../../../../ui/TextButton';

export interface GroupChannelListItemViewProps {
  channel: GroupChannel;
  tabIndex: number;
  isTyping: boolean;
  isSelected: boolean;
  channelName: string;
  isMessageStatusEnabled?: boolean;
  onClick?: () => void;
  onLeaveChannel?: () => void;
  renderChannelAction: (props: { channel: GroupChannel }) => React.ReactElement;
}
export const GroupChannelListItemView = ({
  channel,
  tabIndex,
  isTyping,
  isSelected,
  channelName,
  isMessageStatusEnabled = true,
  onClick = noop,
  onLeaveChannel = noop,
  renderChannelAction,
}: GroupChannelListItemViewProps) => {
  const { config } = useSendbirdStateContext();
  const { theme, isMentionEnabled, userId } = config;
  const { dateLocale, stringSet } = useLocalization();
  const { isMobile } = useMediaQueryContext();

  const [showMobileLeave, setShowMobileLeave] = useState(false);
  const onLongPress = useLongPress(
    {
      onLongPress: () => {
        if (isMobile) {
          setShowMobileLeave(true);
        }
      },
      onClick,
    },
    {
      delay: 1000,
    },
  );

  return (
    <>
      <div
        className={[
          'sendbird-channel-preview',
          isSelected ? 'sendbird-channel-preview--active' : '',
        ].join(' ')}
        role="link"
        tabIndex={tabIndex}
        {...(isMobile ? { ...onLongPress } : { onClick })}
      >
        <div className="sendbird-channel-preview__avatar">
          <ChannelAvatar channel={channel} userId={userId} theme={theme} />
        </div>
        <div className="sendbird-channel-preview__content">
          <div className="sendbird-channel-preview__content__upper">
            <div className="sendbird-channel-preview__content__upper__header">
              {(channel.isBroadcast || false) && (
                <div className="sendbird-channel-preview__content__upper__header__broadcast-icon">
                  <Icon
                    type={IconTypes.BROADCAST}
                    fillColor={IconColors.SECONDARY}
                    height="16px"
                    width="16px"
                  />
                </div>
              )}
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
                {getTotalMembers(channel)}
              </Label>
              {(channel.isFrozen) && (
                <div
                  title="Frozen"
                  className="sendbird-channel-preview__content__upper__header__frozen-icon"
                >
                  <Icon
                    type={IconTypes.FREEZE}
                    fillColor={IconColors.PRIMARY}
                    height={12}
                    width={12}
                  />
                </div>
              )}
            </div>
            {!channel.isEphemeral && isMessageStatusEnabled && (
              <MessageStatus
                className="sendbird-channel-preview__content__upper__last-message-at"
                channel={channel}
                message={channel.lastMessage as CoreMessageType}
                isDateSeparatorConsidered={false}
              />
            )}
            {!channel.isEphemeral && !isMessageStatusEnabled && (
              <Label
                className="sendbird-channel-preview__content__upper__last-message-at"
                type={LabelTypography.CAPTION_3}
                color={LabelColors.ONBACKGROUND_2}
              >
                {getLastMessageCreatedAt({
                  channel,
                  locale: dateLocale,
                  stringSet,
                })}
              </Label>
            )}
          </div>
          <div className="sendbird-channel-preview__content__lower">
            <Label
              className="sendbird-channel-preview__content__lower__last-message"
              type={LabelTypography.BODY_2}
              color={LabelColors.ONBACKGROUND_3}
            >
              {isTyping && (
                <TypingIndicatorText members={channel.getTypingUsers()} />
              )}
              {!isTyping
                && !isVoiceMessage(channel.lastMessage as FileMessage | null)
                && getLastMessage(channel, stringSet)}
              {!isTyping
                && isVoiceMessage(channel.lastMessage as FileMessage | null)
                && stringSet.VOICE_MESSAGE}
            </Label>
            {
              /**
               * Do not show unread count for focused channel. This is because of the limitation where
               * isScrollBottom and hasNext states needs to be added globally but they are from channel context
               * so channel list cannot see them with the current architecture.
               */
              !isSelected && !channel.isEphemeral && (
                <div className="sendbird-channel-preview__content__lower__unread-message-count">
                  {isMentionEnabled && channel.unreadMentionCount > 0 ? (
                    <MentionUserLabel
                      className="sendbird-channel-preview__content__lower__unread-message-count__mention"
                      color="purple"
                    >
                      {'@'}
                    </MentionUserLabel>
                  ) : null}
                  {getChannelUnreadMessageCount(channel) ? ( // return number
                    <Badge count={getChannelUnreadMessageCount(channel)} />
                  ) : null}
                </div>
              )
            }
          </div>
        </div>
        {!isMobile && (
          <div className="sendbird-channel-preview__action">
            {renderChannelAction({ channel })}
          </div>
        )}
      </div>
      {/*
        Event from portal is transferred to parent
        If this modal goes inside channel preview, it will propogate event to
        ChannelPreview and cause many issues with click/touchEnd etc
        https://github.com/facebook/react/issues/11387#issuecomment-340019419
      */}
      {showMobileLeave && isMobile && (
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
      )}
    </>
  );
};
