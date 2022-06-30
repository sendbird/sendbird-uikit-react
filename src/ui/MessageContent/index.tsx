import React, {
  ReactElement,
  useContext,
  useRef,
  useState,
} from 'react';
import format from 'date-fns/format';
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
  getSenderName,
} from '../../utils';
import { UserProfileContext } from '../../lib/UserProfileContext';
import { ReplyType } from '../../index.js';
import { useLocalization } from '../../lib/LocalizationContext';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { EmojiContainer } from '@sendbird/chat';
import { FileMessage, UserMessage } from '@sendbird/chat/message';

interface Props {
  className?: string | Array<string>;
  userId: string;
  channel: GroupChannel;
  message: UserMessage | FileMessage;
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
  resendMessage?: (message: UserMessage | FileMessage) => Promise<UserMessage | FileMessage>;
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
  nicknamesMap,
  emojiContainer,
  scrollToMessage,
  showEdit,
  showRemove,
  showFileViewer,
  resendMessage,
  toggleReaction,
  setQuoteMessage,
}: Props): ReactElement {
  const messageTypes = getUIKitMessageTypes();
  const { dateLocale } = useLocalization();
  const { config } = useSendbirdStateContext?.() || {};
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
  const useReplying = !!((replyType === 'QUOTE_REPLY') && message?.parentMessageId && message?.parentMessage);
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
                // @ts-ignore
                src={channel?.members?.find((member) => member?.userId === message?.sender?.userId)?.profileUrl || message?.sender?.profileUrl || ''}
                // TODO: Divide getting profileUrl logic to utils
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
                  // @ts-ignore
                  ? renderUserProfile({ user: message?.sender, close: closeDropdown })
                  // @ts-ignore
                  : (<UserProfile user={message.sender} onSuccess={closeDropdown} />)
                }
              </MenuItems>
            )}
          />
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
            {
              // @ts-ignore
              channel?.members?.find((member) => member?.userId === message?.sender?.userId)?.nickname
              || getSenderName(message)
              // TODO: Divide getting profileUrl logic to utils
            }
          </Label>
        )}
        {/* quote message */}
        {(useReplying) ? (
          <div className={getClassName(['sendbird-message-content__middle__quote-message', isByMe ? 'outgoing' : 'incoming', useReplyingClassName])}>
            <QuoteMessage
              message={message}
              userId={userId}
              isByMe={isByMe}
              onClick={() => {
                if (message?.parentMessage?.createdAt && message?.parentMessageId) {
                  scrollToMessage(message.parentMessage.createdAt, message.parentMessageId);
                }
              }}
            />
          </div>
        ) : null}
        {/* container: message item body + emoji reactions */}
        <div className={getClassName(['sendbird-message-content__middle__body-container'])} >
          {/* message status component */}
          {(isByMe && !chainBottom) && (
            <div className={getClassName(['sendbird-message-content__middle__body-container__created-at', 'left', supposedHoverClassName])}>
              <div className="sendbird-message-content__middle__body-container__created-at__component-container">
                <MessageStatus
                  message={message}
                  channel={channel}
                />
              </div>
            </div>
          )}
          {/* message item body components */}
          {isTextMessage(message as UserMessage) && (
            <TextMessageItemBody
              className="sendbird-message-content__middle__message-item-body"
              message={message as UserMessage}
              isByMe={isByMe}
              mouseHover={mouseHover}
              isMentionEnabled={config?.isMentionEnabled || false}
            />
          )}
          {(isOGMessage(message as UserMessage)) && (
            <OGMessageItemBody
              className="sendbird-message-content__middle__message-item-body"
              message={message as UserMessage}
              isByMe={isByMe}
              mouseHover={mouseHover}
              isMentionEnabled={config?.isMentionEnabled || false}
            />
          )}
          {(getUIKitMessageType((message as FileMessage)) === messageTypes.FILE) && (
            <FileMessageItemBody
              className="sendbird-message-content__middle__message-item-body"
              message={message as FileMessage}
              isByMe={isByMe}
              mouseHover={mouseHover}
            />
          )}
          {(isThumbnailMessage(message as FileMessage)) && (
            <ThumbnailMessageItemBody
              className="sendbird-message-content__middle__message-item-body"
              message={message as FileMessage}
              isByMe={isByMe}
              mouseHover={mouseHover}
              showFileViewer={showFileViewer}
            />
          )}
          {(getUIKitMessageType((message as FileMessage)) === messageTypes.UNKNOWN) && (
            <UnknownMessageItemBody
              className="sendbird-message-content__middle__message-item-body"
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
              className={getClassName(['sendbird-message-content__middle__body-container__created-at', 'right', supposedHoverClassName])}
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
      {/* right */}
      <div className={getClassName(['sendbird-message-content__right', chainTopClassName, useReactionClassName, useReplyingClassName])}>
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
