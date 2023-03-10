import React, { useContext, useRef, useState } from 'react';
import { EmojiContainer } from '@sendbird/chat';
import { FileMessage, UserMessage } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import './ThreadListItemContent.scss';

import { ReplyType } from '../../../../types';
import ContextMenu, { MenuItems } from '../../../../ui/ContextMenu';
import Avatar from '../../../../ui/Avatar';
import { UserProfileContext } from '../../../../lib/UserProfileContext';
import { UserProfileContextInterface } from '../../../../ui/MessageContent';
import UserProfile from '../../../../ui/UserProfile';
import MessageItemMenu from '../../../../ui/MessageItemMenu';
import MessageItemReactionMenu from '../../../../ui/MessageItemReactionMenu';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { getClassName, getSenderName, getUIKitMessageType, getUIKitMessageTypes, isOGMessage, isTextMessage, isThumbnailMessage, isVoiceMessage } from '../../../../utils';
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

export interface ThreadListItemContentProps {
  className?: string;
  userId: string;
  channel: GroupChannel;
  message: UserMessage | FileMessage;
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
  resendMessage?: (message: UserMessage | FileMessage) => void;
  toggleReaction?: (message: UserMessage | FileMessage, reactionKey: string, isReacted: boolean) => void;
  onReplyInThread?: (props: { message: UserMessage | FileMessage }) => void;
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
  const { dateLocale } = useLocalization();
  const [supposedHover, setSupposedHover] = useState(false);
  const {
    disableUserProfile,
    renderUserProfile,
  } = useContext<UserProfileContextInterface>(UserProfileContext);
  const avatarRef = useRef(null);

  const isByMe = (userId === (message as UserMessage | FileMessage)?.sender?.userId)
    || ((message as UserMessage | FileMessage)?.sendingStatus === 'pending')
    || ((message as UserMessage | FileMessage)?.sendingStatus === 'failed');
  const useReplying = !!((replyType === 'QUOTE_REPLY' || replyType === 'THREAD')
    && message?.parentMessageId && message?.parentMessage
    && !disableQuoteMessage
  );
  const supposedHoverClassName = supposedHover ? 'sendbird-mouse-hover' : '';
  const isReactionEnabledInChannel = isReactionEnabled && !channel?.isEphemeral;

  return (
    <div className={`sendbird-thread-list-item-content ${className} ${isByMe ? 'outgoing' : 'incoming'}`}>
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
              <MenuItems
                parentRef={avatarRef}
                parentContainRef={avatarRef}
                closeDropdown={closeDropdown}
                style={{ paddingTop: '0px', paddingBottom: '0px' }}
              >
                {renderUserProfile
                  ? renderUserProfile({ user: message?.sender, close: closeDropdown })
                  : <UserProfile user={message?.sender} onSuccess={closeDropdown} />
                }
              </MenuItems>
            )}
          />
        )}
        {isByMe && (
          <div
            className={`sendbird-thread-list-item-content-menu ${isReactionEnabledInChannel ? 'use-reaction' : ''
              } ${isByMe ? 'outgoing' : 'incoming'
              } ${supposedHoverClassName}`}
          >
            <MessageItemMenu
              className="sendbird-thread-list-item-content-menu__normal-menu"
              channel={channel}
              message={message as UserMessage | FileMessage}
              isByMe={isByMe}
              replyType={replyType}
              disabled={disabled}
              showEdit={showEdit}
              showRemove={showRemove}
              resendMessage={resendMessage}
              setSupposedHover={setSupposedHover}
              onReplyInThread={onReplyInThread}
            />
            {isReactionEnabledInChannel && (
              <MessageItemReactionMenu
                className="sendbird-thread-list-item-content-menu__reaction-menu"
                message={message as UserMessage | FileMessage}
                userId={userId}
                spaceFromTrigger={{}}
                emojiContainer={emojiContainer}
                toggleReaction={toggleReaction}
                setSupposedHover={setSupposedHover}
              />
            )}
          </div>
        )}
      </div>
      <div className="sendbird-thread-list-item-content__middle">
        {(!isByMe && !chainTop && !useReplying) && (
          <Label
            className="sendbird-thread-list-item-content__middle__sender-name"
            type={LabelTypography.CAPTION_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {
              channel?.members?.find((member) => member?.userId === message?.sender?.userId)?.nickname
              || getSenderName(message as UserMessage | FileMessage)
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
                  message={message as UserMessage | FileMessage}
                  channel={channel}
                />
              </div>
            </div>
          )}
          {/* message item body components */}
          {isTextMessage(message as UserMessage) && (
            <TextMessageItemBody
              className="sendbird-thread-list-item-content__middle__message-item-body"
              message={message as UserMessage}
              isByMe={isByMe}
              isMentionEnabled={isMentionEnabled}
              isReactionEnabled={isReactionEnabledInChannel}
            />
          )}
          {(isOGMessage(message as UserMessage)) && (
            <OGMessageItemBody
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
            />
          )}
          {(isThumbnailMessage(message as FileMessage)) && (
            <ThumbnailMessageItemBody
              className="sendbird-thread-list-item-content__middle__message-item-body"
              message={message as FileMessage}
              isByMe={isByMe}
              isReactionEnabled={isReactionEnabledInChannel}
              showFileViewer={showFileViewer}
              style={{
                width: '200px',
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
              (!isByMe || isThumbnailMessage(message as FileMessage) || isOGMessage(message as UserMessage)) ? '' : 'primary',
            ])}>
              <EmojiReactions
                userId={userId}
                message={message as UserMessage | FileMessage}
                isByMe={isByMe}
                emojiContainer={emojiContainer}
                memberNicknamesMap={nicknamesMap}
                toggleReaction={toggleReaction}
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
        {!isByMe && (
          <div className={`sendbird-thread-list-item-content-menu ${supposedHoverClassName}`}>
            {isReactionEnabledInChannel && (
              <MessageItemReactionMenu
                className="sendbird-thread-list-item-content-menu__reaction-menu"
                message={message as UserMessage | FileMessage}
                userId={userId}
                spaceFromTrigger={{}}
                emojiContainer={emojiContainer}
                toggleReaction={toggleReaction}
                setSupposedHover={setSupposedHover}
              />
            )}
            <MessageItemMenu
              className="sendbird-thread-list-item-content-menu__normal-menu"
              channel={channel}
              message={message as UserMessage | FileMessage}
              isByMe={isByMe}
              replyType={replyType}
              disabled={disabled}
              showRemove={showRemove}
              resendMessage={resendMessage}
              setSupposedHover={setSupposedHover}
              onReplyInThread={onReplyInThread}
            />
          </div>
        )}
      </div>
    </div>
  );
}
