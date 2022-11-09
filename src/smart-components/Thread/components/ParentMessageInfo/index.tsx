import React, { useMemo, useState } from 'react';
import format from 'date-fns/format';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, UserMessage } from '@sendbird/chat/message';

import './index.scss';

import Avatar from '../../../../ui/Avatar';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import {
  getSenderName,
  getUIKitMessageType,
  getUIKitMessageTypes,
  isOGMessage,
  isTextMessage,
  isThumbnailMessage,
} from '../../../../utils';
import { useLocalization } from '../../../../lib/LocalizationContext';
import TextMessageItemBody from '../../../../ui/TextMessageItemBody';
import OGMessageItemBody from '../../../../ui/OGMessageItemBody';
import FileMessageItemBody from '../../../../ui/FileMessageItemBody';
import ThumbnailMessageItemBody from '../../../../ui/ThumbnailMessageItemBody';
import UnknownMessageItemBody from '../../../../ui/UnknownMessageItemBody';
import EmojiReactions from '../../../../ui/EmojiReactions';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useThreadContext } from '../../context/ThreadProvider';
import MessageItemMenu from '../../../../ui/MessageItemMenu';
import RemoveMessage from '../RemoveMessageModal';
import MessageItemReactionMenu from '../../../../ui/MessageItemReactionMenu';

interface ParentMessageInfoProps {
  className?: string;
  channel: GroupChannel;
  message: UserMessage | FileMessage;
}

export default function ParentMessageInfo({
  className,
  channel,
  message,
}: ParentMessageInfoProps): React.ReactElement {
  const { stores, config } = useSendbirdStateContext();
  const {
    isMentionEnabled,
    isReactionEnabled,
    replyType,
  } = config;
  const userId = stores?.userStore?.user?.userId;
  const { dateLocale } = useLocalization?.();
  const messageTypes = getUIKitMessageTypes?.();
  const {
    emojiContainer,
    nicknamesMap,
    toggleReaction,
    currentChannel,
  } = useThreadContext();

  const [showRemove, setShowRemove] = useState(false);
  const [supposedHover, setSupposedHover] = useState(false);
  const usingReaction = isReactionEnabled && !currentChannel?.isSuper && !currentChannel?.isBroadcast

  const MemorizedEmojiReactions = useMemo(() => {
    return replyType === 'THREAD' && message?.reactions?.length > 0 && (
      <div className="sendbird-parent-message-info__content__reactions">
        <EmojiReactions
          userId={userId}
          message={message}
          isByMe={false}
          emojiContainer={emojiContainer}
          memberNicknamesMap={nicknamesMap}
          toggleReaction={toggleReaction}
        />
      </div>
    )
  }, [message?.reactions, replyType, emojiContainer, nicknamesMap, toggleReaction, userId]);

  return (
    <div className={`sendbird-parent-message-info ${className}`}>
      {/* apply user profile */}
      <Avatar
        className="sendbird-parent-message-info__sender"
        src={message?.sender?.profileUrl}
        alt="thread message sender"
        width="40px"
        height="40px"
      />
      <div className="sendbird-parent-message-info__content">
        <div className="sendbird-parent-message-info__content__info">
          <Label
            className="sendbird-parent-message-info__content__info__sender-name"
            type={LabelTypography.CAPTION_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {
              channel?.members?.find((member) => member?.userId === message?.sender?.userId)
                ?.nickname || getSenderName?.(message as UserMessage | FileMessage)
            }
          </Label>
          <Label
            className="sendbird-parent-message-info__content__info__sent-at"
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {format(message?.createdAt || 0, 'p', { locale: dateLocale })}
          </Label>
        </div>
        {/* message content body */}
        {isTextMessage(message as UserMessage) && (
          <TextMessageItemBody
            className="sendbird-parent-message-info__content__body"
            message={message as UserMessage}
            isByMe={false}
            // mouseHover -> for style
            isMentionEnabled={isMentionEnabled}
            isReactionEnabled={usingReaction}
          />
        )}
        {isOGMessage(message as UserMessage) && (
          <OGMessageItemBody
            className="sendbird-parent-message-info__content__body"
            message={message as UserMessage}
            isByMe={false}
            // mouseHover -> for style
            isMentionEnabled={isMentionEnabled}
            isReactionEnabled={usingReaction}
          />
        )}
        {getUIKitMessageType(message as FileMessage) === messageTypes?.FILE && (
          <FileMessageItemBody
            className="sendbird-parent-message-info__content__body"
            message={message as FileMessage}
            isByMe={false}
            // mouseHover -> for style
            isReactionEnabled={usingReaction}
          />
        )}
        {isThumbnailMessage(message as FileMessage) && (
          <ThumbnailMessageItemBody
            className="sendbird-parent-message-info__content__body"
            message={message as FileMessage}
            isByMe={false}
            // showFileViewer
            // mouseHover -> for style
            isReactionEnabled={usingReaction}
            style={{
              width: '200px',
              height: '148px',
            }}
          />
        )}
        {getUIKitMessageType(message) === messageTypes?.UNKNOWN && (
          <UnknownMessageItemBody
            className="sendbird-parent-message-info__content__body"
            message={message}
            isByMe={false}
            // mouseHover -> for style
            isReactionEnabled={usingReaction}
          />
        )}
        {/* reactions */}
        {MemorizedEmojiReactions}
      </div>
      {/* context menu */}
      <MessageItemMenu
        className={`sendbird-parent-message-info__context-menu ${usingReaction ? 'use-reaction' : ''} ${supposedHover ? 'supposed-hover' : ''}`}
        channel={channel}
        message={message}
        isByMe={userId === message?.sender?.userId}
        replyType={replyType}
        showRemove={setShowRemove}
        setSupposedHover={setSupposedHover}
      />
      {usingReaction && (
        <MessageItemReactionMenu
          className={`sendbird-parent-message-info__reaction-menu ${usingReaction ? 'supposed-hover' : ''}`}
          message={message}
          userId={userId}
          emojiContainer={emojiContainer}
          toggleReaction={toggleReaction}
          setSupposedHover={setSupposedHover}
        />
      )}
      {
        showRemove && (
          <RemoveMessage
            onCancel={() => setShowRemove(false)}
            message={message}
          />
        )
      }
    </div>
  );
}
