import React, { ReactElement, useContext, useRef, useState } from 'react';
// import { GroupChannel, AdminMessage, UserMessage, FileMessage, EmojiContainer } from 'sendbird';
import { GroupChannel, AdminMessage, UserMessage, FileMessage, EmojiContainer } from '../../sendbird.min.js';
import './index.scss';

import Avatar from '../Avatar';
import UserProfile from '../UserProfile';
import MessageStatus from '../MessageStatus';
import MessageItemMenu from '../MessageItemMenu';
import MessageItemReactionMenu from '../MessageItemReactionMenu';
import ContextMenu, { MenuItems } from '../ContextMenu';
import Label, { LabelTypography, LabelColors } from '../Label';
import EmojiReactions from '../EmojiReactions';

import ClientAdminMessage from '../AdminMessage';
import TextMessageItemBody from '../TextMessageItemBody';
import FileMessageItemBody from '../FileMessageItemBody';
import ThumbnailMessageItemBody from '../ThumbnailMessageItemBody';
import OGMessageItemBody from '../OGMessageItemBody';
import UnknownMessageItemBody from '../UnknownMessageItemBody';
import QuoteMessage from '../QuoteMessage';

import {
  getClassName,
  getUIKitMessageTypes,
  getUIKitMessageType,
  isTextMessage,
  isOGMessage,
  isThumbnailMessage,
  getOutgoingMessageState,
  getSenderName,
  getMessageCreatedAt,
} from '../../utils';
import { UserProfileContext } from '../../lib/UserProfileContext';
import { ReplyType } from '../../index.js';

interface Props {
  className?: string | Array<string>;
  userId: string;
  channel: GroupChannel;
  message: AdminMessage | UserMessage | FileMessage;
  disabled?: boolean;
  chainTop?: boolean;
  chainBottom?: boolean;
  useReaction?: boolean;
  replyType?: ReplyType;
  nicknamesMap?: Map<string, string>;
  emojiContainer?: EmojiContainer;
  scrollToMessage?: (createdAt: number, messageId: number) => void;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  showFileViewer?: (bool: boolean) => void;
  resendMessage?: (message: UserMessage | FileMessage) => void;
  toggleReaction?: (message: UserMessage | FileMessage, reactionKey: string, isReacted: boolean) => void;
  setQuoteMessage?: (message: UserMessage | FileMessage) => void;
}
export default function MessageContent({
  className,
  userId,
  channel,
  message,
  disabled = false,
  chainTop = false,
  chainBottom = false,
  useReaction = false,
  replyType,
  // scrollToMessage,
  nicknamesMap,
  emojiContainer,
  showEdit,
  showRemove,
  showFileViewer,
  resendMessage,
  toggleReaction,
  setQuoteMessage,
}: Props): ReactElement {
  const messageTypes = getUIKitMessageTypes();
  const { disableUserProfile, renderUserProfile } = useContext(UserProfileContext);
  const avatarRef = useRef(null);
  const [mouseHover, setMouseHover] = useState(false);
  const [supposedHover, setSupposedHover] = useState(false);

  const isByMe = (userId === (message as UserMessage | FileMessage)?.sender?.userId)
    || ((message as UserMessage | FileMessage).sendingStatus === 'pending')
    || ((message as UserMessage | FileMessage).sendingStatus === 'failed');
  const isByMeClassName = isByMe ? 'outgoing' : 'incoming';
  const chainTopClassName = chainTop ? 'chain-top' : '';
  const useReactionClassName = useReaction ? 'use-reactions' : '';
  const supposedHoverClassName = supposedHover ? 'supposed-hover' : '';
  const useReplying: boolean = replyType === 'QUOTE_REPLY' && message?.parentMessageId;
  const useReplyingClassName = useReplying ? 'use-quote' : '';

  if (message?.isAdminMessage?.() || message?.messageType === 'admin') {
    return (<ClientAdminMessage message={message} />);
  }
  return (
    <div
      className={getClassName([className, 'sendbird-message-content', isByMeClassName])}
      onMouseOver={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      {/* left */}
      <div className={getClassName(['sendbird-message-content__left', useReactionClassName, isByMeClassName, useReplyingClassName])}>
        {(!isByMe && !chainBottom) && (
          /** user profile */
          <ContextMenu
            menuTrigger={(toggleDropdown: () => void): ReactElement => (
              <Avatar
                className="sendbird-message-content__left__avatar"
                src={message?.sender?.profileUrl || ''}
                ref={avatarRef}
                width="28px"
                height="28px"
                onClick={(): void => { if (!disableUserProfile) toggleDropdown() }}
              />
            )}
            menuItems={(closeDropdown: () => void): ReactElement => (
              <MenuItems
                /**
                * parentRef: For catching location(x, y) of MenuItems
                * parentContainRef: For toggling more options(menus & reactions)
                */
                parentRef={avatarRef}
                parentContainRef={avatarRef}
                closeDropdown={closeDropdown}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              >
                {renderUserProfile
                  ? renderUserProfile({ user: message?.sender, close: closeDropdown })
                  : (<UserProfile user={message.sender} onSuccess={closeDropdown} />)
                }
              </MenuItems>
            )}
          />
        )}
        {(isByMe && !chainBottom) && (
          <div className={getClassName(['sendbird-message-content__left__created-at', supposedHoverClassName])}>
            <MessageStatus
              message={message}
              status={getOutgoingMessageState(channel, message)}
            />
          </div>
        )}
        {/* outgoing menu */}
        {isByMe && (
          <div className={getClassName(['sendbird-message-content-menu', useReactionClassName, supposedHoverClassName, isByMeClassName])}>
            <MessageItemMenu
              className="sendbird-message-content-menu__normal-menu"
              channel={channel}
              message={message as UserMessage | FileMessage}
              isByMe={isByMe}
              replyType={replyType}
              disabled={disabled}
              showEdit={showEdit}
              showRemove={showRemove}
              resendMessage={resendMessage}
              setQuoteMessage={setQuoteMessage}
              setSupposedHover={setSupposedHover}
            />
            {useReaction && (
              <MessageItemReactionMenu
                className="sendbird-message-content-menu__reaction-menu"
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
      {/* middle */}
      <div className="sendbird-message-content__middle">
        {(!isByMe && !chainTop && !useReplying) && (
          <Label
            className="sendbird-message-content__middle__sender-name"
            type={LabelTypography.CAPTION_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {getSenderName(message)}
          </Label>
        )}
        {/* quote message */}
        {(useReplying) ? (
          <div className={getClassName(['sendbird-message-content__middle__quote-message', isByMe ? 'outgoing' : 'incoming'])}>
          <QuoteMessage message={message} isByMe={isByMe} />
          </div>
        ): null}
        {/* message item body components */}
        {isTextMessage(message as UserMessage) && (
          <TextMessageItemBody
            className={['sendbird-message-content__middle__message-item-body', useReplyingClassName]}
            message={message as UserMessage}
            isByMe={isByMe}
            mouseHover={mouseHover}
          />
        )}
        {(isOGMessage(message as UserMessage)) && (
          <OGMessageItemBody
            className={['sendbird-message-content__middle__message-item-body', useReplyingClassName]}
            message={message as UserMessage}
            isByMe={isByMe}
            mouseHover={mouseHover}
          />
        )}
        {(getUIKitMessageType((message as FileMessage)) === messageTypes.FILE) && (
          <FileMessageItemBody
            className={['sendbird-message-content__middle__message-item-body', useReplyingClassName]}
            message={message as FileMessage}
            isByMe={isByMe}
            mouseHover={mouseHover}
          />
        )}
        {(isThumbnailMessage(message as FileMessage)) && (
          <ThumbnailMessageItemBody
            className={['sendbird-message-content__middle__message-item-body', useReplyingClassName]}
            message={message as FileMessage}
            isByMe={isByMe}
            mouseHover={mouseHover}
            showFileViewer={showFileViewer}
          />
        )}
        {(getUIKitMessageType((message as FileMessage)) === messageTypes.UNKNOWN) && (
          <UnknownMessageItemBody
            className={['sendbird-message-content__middle__message-item-body', useReplyingClassName]}
            message={message}
            isByMe={isByMe}
            mouseHover={mouseHover}
          />
        )}
        {/* reactions */}
        {(useReaction && message?.reactions?.length > 0) && (
          <div className={getClassName([
            'sendbird-message-content-reactions',
            (!isByMe || isThumbnailMessage(message as FileMessage) || isOGMessage(message as UserMessage)) ? '' : 'primary',
            mouseHover ? 'mouse-hover' : '',
          ])}>
            <EmojiReactions
              userId={userId}
              message={message}
              isByMe={isByMe}
              emojiContainer={emojiContainer}
              memberNicknamesMap={nicknamesMap}
              toggleReaction={toggleReaction}
            />
          </div>
        )}
      </div>
      {/* right */}
      <div className={getClassName(['sendbird-message-content__right', chainTopClassName, useReactionClassName, useReplyingClassName])}>
        {(!isByMe && !chainBottom) && (
          <Label
            className={getClassName(['sendbird-message-content__right__created-at', supposedHoverClassName])}
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {getMessageCreatedAt(message)}
          </Label>
        )}
        {/* incoming menu */}
        {!isByMe && (
          <div className={getClassName(['sendbird-message-content-menu', chainTopClassName, supposedHoverClassName, isByMeClassName])}>
            {useReaction && (
              <MessageItemReactionMenu
                className="sendbird-message-content-menu__reaction-menu"
                message={message as UserMessage | FileMessage}
                userId={userId}
                spaceFromTrigger={{}}
                emojiContainer={emojiContainer}
                toggleReaction={toggleReaction}
                setSupposedHover={setSupposedHover}
              />
            )}
            <MessageItemMenu
              className="sendbird-message-content-menu__normal-menu"
              channel={channel}
              message={message as UserMessage | FileMessage}
              isByMe={isByMe}
              replyType={replyType}
              disabled={disabled}
              showEdit={showEdit}
              showRemove={showRemove}
              resendMessage={resendMessage}
              setQuoteMessage={setQuoteMessage}
              setSupposedHover={setSupposedHover}
            />
          </div>
        )}
      </div>
    </div>
  );
}
