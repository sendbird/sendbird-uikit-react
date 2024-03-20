import React, { useContext, useRef, useState } from 'react';
import { EmojiContainer } from '@sendbird/chat';
import { FileMessage, MultipleFilesMessage, UserMessage } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import './ThreadListItemContent.scss';

import { ReplyType } from '../../../../types';
import ContextMenu, { MenuItems } from '../../../../ui/ContextMenu';
import Avatar from '../../../../ui/Avatar';
import { UserProfileContext } from '../../../../lib/UserProfileContext';
import UserProfile from '../../../../ui/UserProfile';
import MessageItemMenu from '../../../../ui/MessageItemMenu';
import MessageItemReactionMenu from '../../../../ui/MessageItemReactionMenu';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import {
  getClassName,
  getSenderName,
  getUIKitMessageType,
  getUIKitMessageTypes,
  isMultipleFilesMessage,
  isOGMessage,
  isTextMessage,
  isThumbnailMessage,
  isVoiceMessage,
  SendableMessageType,
} from '../../../../utils';
import MessageStatus from '../../../../ui/MessageStatus';
import EmojiReactions from '../../../../ui/EmojiReactions';
import format from 'date-fns/format';
import { useLocalization } from '../../../../lib/LocalizationContext';
import TextMessageItemBody from '../../../../ui/TextMessageItemBody';
import OGMessageItemBody from '../../../../ui/OGMessageItemBody';
import FileMessageItemBody from '../../../../ui/FileMessageItemBody';
import ThumbnailMessageItemBody from '../../../../ui/ThumbnailMessageItemBody';
import UnknownMessageItemBody from '../../../../ui/UnknownMessageItemBody';
import VoiceMessageItemBody from '../../../../ui/VoiceMessageItemBody';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import useLongPress from '../../../../hooks/useLongPress';
import MobileMenu from '../../../../ui/MobileMenu';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import MultipleFilesMessageItemBody, { ThreadMessageKind } from '../../../../ui/MultipleFilesMessageItemBody';
import { useThreadMessageKindKeySelector } from '../../../Channel/context/hooks/useThreadMessageKindKeySelector';
import { useFileInfoListWithUploaded } from '../../../Channel/context/hooks/useFileInfoListWithUploaded';
import { useThreadContext } from '../../context/ThreadProvider';

export interface ThreadListItemContentProps {
  className?: string;
  userId: string;
  channel: GroupChannel;
  message: SendableMessageType;
  disabled?: boolean;
  chainTop?: boolean;
  chainBottom?: boolean;
  isMentionEnabled?: boolean;
  isReactionEnabled?: boolean;
  disableQuoteMessage?: boolean;
  replyType?: ReplyType;
  nicknamesMap?: Map<string, string>;
  emojiContainer?: EmojiContainer;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  showFileViewer?: (bool: boolean) => void;
  resendMessage?: (message: SendableMessageType) => void;
  toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
}

export default function ThreadListItemContent({
  className,
  userId,
  channel,
  message,
  disabled = false,
  chainTop = false,
  chainBottom = false,
  isMentionEnabled = false,
  isReactionEnabled = false,
  disableQuoteMessage = false,
  replyType,
  nicknamesMap,
  emojiContainer,
  showEdit,
  showRemove,
  showFileViewer,
  resendMessage,
  toggleReaction,
  onReplyInThread,
}: ThreadListItemContentProps): React.ReactElement {
  const messageTypes = getUIKitMessageTypes();
  const { isMobile } = useMediaQueryContext();
  const { dateLocale } = useLocalization();
  const { config, eventHandlers } = useSendbirdStateContext?.() || {};
  const { logger } = config;
  const onPressUserProfileHandler = eventHandlers?.reaction?.onPressUserProfile;
  const [supposedHover, setSupposedHover] = useState(false);
  const { disableUserProfile, renderUserProfile } = useContext(UserProfileContext);
  const { deleteMessage, onBeforeDownloadFileMessage } = useThreadContext();
  const avatarRef = useRef(null);

  const isByMe = (userId === (message as SendableMessageType)?.sender?.userId)
    || ((message as SendableMessageType)?.sendingStatus === 'pending')
    || ((message as SendableMessageType)?.sendingStatus === 'failed');
  const useReplying = !!((replyType === 'QUOTE_REPLY' || replyType === 'THREAD')
    && message?.parentMessageId && message?.parentMessage
    && !disableQuoteMessage
  );
  const supposedHoverClassName = supposedHover ? 'sendbird-mouse-hover' : '';
  const isReactionEnabledInChannel = isReactionEnabled && !channel?.isEphemeral;
  const isOgMessageEnabledInGroupChannel = channel.isGroupChannel() && config.groupChannel.enableOgtag;

  // Mobile
  const mobileMenuRef = useRef(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const longPress = useLongPress({
    onLongPress: () => {
      if (isMobile) {
        setShowMobileMenu(true);
      }
    },
  }, {
    shouldPreventDefault: false,
  });

  const threadMessageKindKey = useThreadMessageKindKeySelector({
    threadMessageKind: ThreadMessageKind.CHILD,
    isMobile,
  });
  // For MultipleFilesMessage only.
  const statefulFileInfoList = useFileInfoListWithUploaded(message);

  return (
    <div
      className={`sendbird-thread-list-item-content ${className} ${isByMe ? 'outgoing' : 'incoming'}`}
      ref={mobileMenuRef}
    >
      <div className={`sendbird-thread-list-item-content__left ${isReactionEnabledInChannel ? 'use-reaction' : ''} ${isByMe ? 'outgoing' : 'incoming'}`}>
        {(!isByMe && !chainBottom) && (
          <ContextMenu
            menuTrigger={(toggleDropdown) => (
              <Avatar
                className="sendbird-thread-list-item-content__left__avatar"
                src={channel?.members?.find((member) => member?.userId === message?.sender?.userId)?.profileUrl || message?.sender?.profileUrl || ''}
                ref={avatarRef}
                width="28px"
                height="28px"
                onClick={() => {
                  if (!disableUserProfile) {
                    toggleDropdown?.();
                  }
                }}
              />
            )}
            menuItems={(closeDropdown) => (
              renderUserProfile
                ? renderUserProfile({
                  user: message?.sender,
                  close: closeDropdown,
                  currentUserId: userId,
                  avatarRef,
                })
                : (
                  <MenuItems
                    parentRef={avatarRef}
                    parentContainRef={avatarRef}
                    closeDropdown={closeDropdown}
                    style={{ paddingTop: '0px', paddingBottom: '0px' }}
                  >
                    <UserProfile
                      user={message?.sender}
                      onSuccess={closeDropdown}
                    />
                  </MenuItems>
                )
            )}
          />
        )}
        {(isByMe && !isMobile) && (
          <div
            className={`sendbird-thread-list-item-content-menu ${isReactionEnabledInChannel ? 'use-reaction' : ''
            } ${isByMe ? 'outgoing' : 'incoming'
            } ${supposedHoverClassName}`}
          >
            <MessageItemMenu
              className="sendbird-thread-list-item-content-menu__normal-menu"
              channel={channel}
              message={message as SendableMessageType}
              isByMe={isByMe}
              replyType={replyType}
              disabled={disabled}
              showEdit={showEdit}
              showRemove={showRemove}
              resendMessage={resendMessage}
              setSupposedHover={setSupposedHover}
              onReplyInThread={onReplyInThread}
              deleteMessage={deleteMessage}
            />
            {isReactionEnabledInChannel && (
              <MessageItemReactionMenu
                className="sendbird-thread-list-item-content-menu__reaction-menu"
                message={message as SendableMessageType}
                userId={userId}
                emojiContainer={emojiContainer}
                toggleReaction={toggleReaction}
                setSupposedHover={setSupposedHover}
              />
            )}
          </div>
        )}
      </div>
      <div
        className="sendbird-thread-list-item-content__middle"
        {...(isMobile) ? { ...longPress } : {}}
      >
        {(!isByMe && !chainTop && !useReplying) && (
          <Label
            className="sendbird-thread-list-item-content__middle__sender-name"
            type={LabelTypography.CAPTION_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {
              channel?.members?.find((member) => member?.userId === message?.sender?.userId)?.nickname
              || getSenderName(message as SendableMessageType)
              // TODO: Divide getting profileUrl logic to utils
            }
          </Label>
        )}
        <div className={getClassName(['sendbird-thread-list-item-content__middle__body-container'])} >
          {/* message status component */}
          {(isByMe && !chainBottom) && (
            <div className={getClassName(['sendbird-thread-list-item-content__middle__body-container__created-at', 'left', supposedHoverClassName])}>
              <div className="sendbird-thread-list-item-content__middle__body-container__created-at__component-container">
                <MessageStatus
                  message={message as SendableMessageType}
                  channel={channel}
                />
              </div>
            </div>
          )}
          {/* message item body components */}
          {isOgMessageEnabledInGroupChannel && isOGMessage(message as UserMessage)
            ? (<OGMessageItemBody
              className="sendbird-thread-list-item-content__middle__message-item-body"
              message={message as UserMessage}
              isByMe={isByMe}
              isMentionEnabled={isMentionEnabled}
              isReactionEnabled={isReactionEnabledInChannel}
            />
            ) : isTextMessage(message as UserMessage) && (
              <TextMessageItemBody
                className="sendbird-thread-list-item-content__middle__message-item-body"
                message={message as UserMessage}
                isByMe={isByMe}
                isMentionEnabled={isMentionEnabled}
                isReactionEnabled={isReactionEnabledInChannel}
              />
            )}
          {isVoiceMessage(message as FileMessage) && (
            <VoiceMessageItemBody
              className="sendbird-thread-list-item-content__middle__message-item-body"
              message={message as FileMessage}
              channelUrl={channel?.url}
              isByMe={isByMe}
              isReactionEnabled={isReactionEnabledInChannel}
            />
          )}
          {(getUIKitMessageType((message as FileMessage)) === messageTypes.FILE) && (
            <FileMessageItemBody
              className="sendbird-thread-list-item-content__middle__message-item-body"
              message={message as FileMessage}
              isByMe={isByMe}
              isReactionEnabled={isReactionEnabledInChannel}
              truncateLimit={isByMe ? 18 : 14}
              onBeforeDownloadFileMessage={onBeforeDownloadFileMessage}
            />
          )}
          {
            isMultipleFilesMessage(message) && (
              <MultipleFilesMessageItemBody
                className="sendbird-thread-list-item-content__middle__message-item-body"
                message={message as MultipleFilesMessage}
                isByMe={isByMe}
                isReactionEnabled={isReactionEnabled}
                threadMessageKindKey={threadMessageKindKey}
                statefulFileInfoList={statefulFileInfoList}
              />
            )
          }
          {(isThumbnailMessage(message as FileMessage)) && (
            <ThumbnailMessageItemBody
              className="sendbird-thread-list-item-content__middle__message-item-body"
              message={message as FileMessage}
              isByMe={isByMe}
              isReactionEnabled={isReactionEnabledInChannel}
              showFileViewer={showFileViewer}
              style={{
                width: isMobile ? '100%' : '200px',
                height: '148px',
              }}
            />
          )}
          {(getUIKitMessageType((message as FileMessage)) === messageTypes.UNKNOWN) && (
            <UnknownMessageItemBody
              className="sendbird-thread-list-item-content__middle__message-item-body"
              message={message}
              isByMe={isByMe}
              isReactionEnabled={isReactionEnabledInChannel}
            />
          )}
          {/* reactions */}
          {(isReactionEnabledInChannel && message?.reactions?.length > 0) && (
            <div className={getClassName([
              'sendbird-thread-list-item-content-reactions',
              (
                !isByMe
                || isThumbnailMessage(message as FileMessage)
                || (isOgMessageEnabledInGroupChannel && isOGMessage(message as UserMessage))
                || isMultipleFilesMessage(message)
              ) ? '' : 'primary',
            ])}>
              <EmojiReactions
                userId={userId}
                message={message as SendableMessageType}
                channel={channel}
                isByMe={isByMe}
                emojiContainer={emojiContainer}
                memberNicknamesMap={nicknamesMap}
                toggleReaction={toggleReaction}
                onPressUserProfile={onPressUserProfileHandler}
              />
            </div>
          )}
          {(!isByMe && !chainBottom) && (
            <Label
              className={getClassName(['sendbird-thread-list-item-content__middle__body-container__created-at', 'right', supposedHoverClassName])}
              type={LabelTypography.CAPTION_3}
              color={LabelColors.ONBACKGROUND_2}
            >
              {format(message?.createdAt || 0, 'p', {
                locale: dateLocale,
              })}
            </Label>
          )}
        </div>
      </div>
      <div
        className={`sendbird-thread-list-item-content__right ${chainTop ? 'chain-top' : ''
        } ${isByMe ? 'outgoing' : 'incoming'}`}
      >
        {(!isByMe && !isMobile) && (
          <div className={`sendbird-thread-list-item-content-menu ${supposedHoverClassName}`}>
            {isReactionEnabledInChannel && (
              <MessageItemReactionMenu
                className="sendbird-thread-list-item-content-menu__reaction-menu"
                message={message as SendableMessageType}
                userId={userId}
                emojiContainer={emojiContainer}
                toggleReaction={toggleReaction}
                setSupposedHover={setSupposedHover}
              />
            )}
            <MessageItemMenu
              className="sendbird-thread-list-item-content-menu__normal-menu"
              channel={channel}
              message={message as SendableMessageType}
              isByMe={isByMe}
              replyType={replyType}
              disabled={disabled}
              showRemove={showRemove}
              resendMessage={resendMessage}
              setSupposedHover={setSupposedHover}
              onReplyInThread={onReplyInThread}
              deleteMessage={deleteMessage}
            />
          </div>
        )}
      </div>
      {showMobileMenu && (
        <MobileMenu
          parentRef={mobileMenuRef}
          channel={channel}
          message={message}
          userId={userId}
          replyType={replyType}
          hideMenu={() => {
            setShowMobileMenu(false);
          }}
          isReactionEnabled={isReactionEnabled}
          isByMe={isByMe}
          emojiContainer={emojiContainer}
          showEdit={showEdit}
          showRemove={showRemove}
          toggleReaction={toggleReaction}
          isOpenedFromThread
          deleteMessage={deleteMessage}
          onDownloadClick={async (e) => {
            if (!onBeforeDownloadFileMessage) {
              return null;
            }
            try {
              const allowDownload = await onBeforeDownloadFileMessage({ message: message as FileMessage });
              if (!allowDownload) {
                e.preventDefault();
                logger?.info?.('ThreadListItemContent: Not allowed to download.');
              }
            } catch (err) {
              logger?.error?.('ThreadListItemContent: Error occurred while determining download continuation:', err);
            }
          }}
        />
      )}
    </div>
  );
}
