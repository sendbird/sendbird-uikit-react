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
  isSentMessage,
  isVoiceMessage,
} from '../../utils';
import { UserProfileContext } from '../../lib/UserProfileContext';
import { ReplyType } from '../../index';
import { useLocalization } from '../../lib/LocalizationContext';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { EmojiContainer } from '@sendbird/chat';
import { AdminMessage, FileMessage, Sender, UserMessage } from '@sendbird/chat/message';
import useLongPress from '../../hooks/useLongPress';
import MobileMenu from '../MobileMenu';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import ThreadReplies from '../ThreadReplies';
import { ThreadReplySelectType } from '../../modules/Channel/context/const';
import VoiceMessageItemBody from '../VoiceMessageItemBody';

// should initialize in UserProfileContext.jsx
export interface UserProfileContextInterface {
  disableUserProfile: boolean;
  isOpenChannel: boolean;
  renderUserProfile?: (props: { user: Sender, close: () => void }) => React.ReactElement,
}

interface Props {
  className?: string | Array<string>;
  userId: string;
  channel: GroupChannel;
  message: AdminMessage | UserMessage | FileMessage;
  disabled?: boolean;
  chainTop?: boolean;
  chainBottom?: boolean;
  isReactionEnabled?: boolean;
  disableQuoteMessage?: boolean;
  replyType?: ReplyType;
  threadReplySelectType?: ThreadReplySelectType;
  nicknamesMap?: Map<string, string>;
  emojiContainer?: EmojiContainer;
  scrollToMessage?: (createdAt: number, messageId: number) => void;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  showFileViewer?: (bool: boolean) => void;
  resendMessage?: (message: UserMessage | FileMessage) => Promise<UserMessage | FileMessage>;
  toggleReaction?: (message: UserMessage | FileMessage, reactionKey: string, isReacted: boolean) => void;
  setQuoteMessage?: (message: UserMessage | FileMessage) => void;
  onReplyInThread?: (props: { message: UserMessage | FileMessage }) => void;
  onQuoteMessageClick?: (props: { message: UserMessage | FileMessage }) => void;
  onMessageHeightChange?: () => void;
}
export default function MessageContent({
  className,
  userId,
  channel,
  message,
  disabled = false,
  chainTop = false,
  chainBottom = false,
  isReactionEnabled = false,
  disableQuoteMessage = false,
  replyType,
  threadReplySelectType,
  nicknamesMap,
  emojiContainer,
  scrollToMessage,
  showEdit,
  showRemove,
  showFileViewer,
  resendMessage,
  toggleReaction,
  setQuoteMessage,
  onReplyInThread,
  onQuoteMessageClick,
  onMessageHeightChange,
}: Props): ReactElement {
  const messageTypes = getUIKitMessageTypes();
  const { dateLocale } = useLocalization();
  const { config } = useSendbirdStateContext?.() || {};
  const { disableUserProfile, renderUserProfile }: UserProfileContextInterface = useContext(UserProfileContext);
  const avatarRef = useRef(null);
  const contentRef = useRef(null);
  const { isMobile } = useMediaQueryContext();
  const [showMenu, setShowMenu] = useState(false);
  const [mouseHover, setMouseHover] = useState(false);
  const [supposedHover, setSupposedHover] = useState(false);

  const isByMe = (userId === (message as UserMessage | FileMessage)?.sender?.userId)
    || ((message as UserMessage | FileMessage)?.sendingStatus === 'pending')
    || ((message as UserMessage | FileMessage)?.sendingStatus === 'failed');
  const isByMeClassName = isByMe ? 'outgoing' : 'incoming';
  const chainTopClassName = chainTop ? 'chain-top' : '';
  const isReactionEnabledInChannel = isReactionEnabled && !channel?.isEphemeral;
  const isReactionEnabledClassName = isReactionEnabledInChannel ? 'use-reactions' : '';
  const supposedHoverClassName = supposedHover ? 'sendbird-mouse-hover' : '';
  const useReplying = !!((replyType === 'QUOTE_REPLY' || replyType === 'THREAD')
    && message?.parentMessageId && message?.parentMessage
    && !disableQuoteMessage
  );
  const useReplyingClassName = useReplying ? 'use-quote' : '';

  // Thread replies
  const displayThreadReplies = message?.threadInfo?.replyCount > 0 && replyType === 'THREAD';

  // onMouseDown: (e: React.MouseEvent<T>) => void;
  // onTouchStart: (e: React.TouchEvent<T>) => void;
  // onMouseUp: (e: React.MouseEvent<T>) => void;
  // onMouseLeave: (e: React.MouseEvent<T>) => void;
  // onTouchEnd: (e: React.TouchEvent<T>) => void;
  const longPress = useLongPress({
    onLongPress: () => {
      if (isMobile) {
        setShowMenu(true);
      }
    },
    onClick: () => {
      // @ts-ignore
      if (isMobile && isThumbnailMessage(message) && isSentMessage(message)) {
        showFileViewer(true);
      }
    },
  }, {
    delay: 300,
  });

  if (message?.isAdminMessage?.() || message?.messageType === 'admin') {
    return (<ClientAdminMessage message={message as AdminMessage} />);
  }
  return (
    <div
      className={getClassName([className, 'sendbird-message-content', isByMeClassName])}
      onMouseOver={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      {/* left */}
      <div className={getClassName(['sendbird-message-content__left', isReactionEnabledClassName, isByMeClassName, useReplyingClassName])}>
        {(!isByMe && !chainBottom) && (
          /** user profile */
          <ContextMenu
            menuTrigger={(toggleDropdown: () => void): ReactElement => (
              <Avatar
                className={`sendbird-message-content__left__avatar ${displayThreadReplies ? 'use-thread-replies' : ''}`}
                // @ts-ignore
                src={channel?.members?.find((member) => member?.userId === message?.sender?.userId)?.profileUrl || message?.sender?.profileUrl || ''}
                // TODO: Divide getting profileUrl logic to utils
                ref={avatarRef}
                width="28px"
                height="28px"
                onClick={(): void => { if (!disableUserProfile) toggleDropdown(); }}
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
                style={{ paddingTop: '0px', paddingBottom: '0px' }}
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
        {isByMe && !isMobile && (
          <div className={getClassName(['sendbird-message-content-menu', isReactionEnabledClassName, supposedHoverClassName, isByMeClassName])}>
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
              onReplyInThread={({ message }) => {
                if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                  onReplyInThread({ message });
                } else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                  scrollToMessage(message.parentMessage.createdAt, message.parentMessageId);
                }
              }}
            />
            {isReactionEnabledInChannel && (
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
      <div
        className="sendbird-message-content__middle"
        {...(isMobile ? { ...longPress } : {})}
        ref={contentRef}
      >
        {(!isByMe && !chainTop && !useReplying) && (
          <Label
            className="sendbird-message-content__middle__sender-name"
            type={LabelTypography.CAPTION_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {
              // @ts-ignore
              channel?.members?.find((member) => member?.userId === message?.sender?.userId)?.nickname
              || getSenderName(message as UserMessage | FileMessage)
              // TODO: Divide getting profileUrl logic to utils
            }
          </Label>
        )}
        {/* quote message */}
        {(useReplying) ? (
          <div className={getClassName(['sendbird-message-content__middle__quote-message', isByMe ? 'outgoing' : 'incoming', useReplyingClassName])}>
            <QuoteMessage
              message={message as UserMessage | FileMessage}
              userId={userId}
              isByMe={isByMe}
              isUnavailable={(replyType === 'THREAD' && (channel?.joinedAt * 1000) > message?.parentMessage?.createdAt)}
              onClick={() => {
                if (replyType === 'THREAD' && threadReplySelectType === ThreadReplySelectType.THREAD) {
                  onQuoteMessageClick?.({ message: message as UserMessage | FileMessage });
                }
                if (
                  (replyType === 'QUOTE_REPLY' || (replyType === 'THREAD' && threadReplySelectType === ThreadReplySelectType.PARENT))
                  && message?.parentMessage?.createdAt && message?.parentMessageId
                ) {
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
                  message={message as UserMessage | FileMessage}
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
              isReactionEnabled={isReactionEnabledInChannel}
            />
          )}
          {(isOGMessage(message as UserMessage)) && (
            <OGMessageItemBody
              className="sendbird-message-content__middle__message-item-body"
              message={message as UserMessage}
              isByMe={isByMe}
              mouseHover={mouseHover}
              isMentionEnabled={config?.isMentionEnabled || false}
              isReactionEnabled={isReactionEnabledInChannel}
              onMessageHeightChange={onMessageHeightChange}
            />
          )}
          {(getUIKitMessageType((message as FileMessage)) === messageTypes.FILE) && (
            <FileMessageItemBody
              className="sendbird-message-content__middle__message-item-body"
              message={message as FileMessage}
              isByMe={isByMe}
              mouseHover={mouseHover}
              isReactionEnabled={isReactionEnabledInChannel}
            />
          )}
          {isVoiceMessage(message as FileMessage) && (
            <VoiceMessageItemBody
              className="sendbird-message-content__middle__message-item-body"
              message={message as FileMessage}
              channelUrl={channel?.url}
              isByMe={isByMe}
              isReactionEnabled={isReactionEnabledInChannel}
            />
          )}
          {(isThumbnailMessage(message as FileMessage)) && (
            <ThumbnailMessageItemBody
              className="sendbird-message-content__middle__message-item-body"
              message={message as FileMessage}
              isByMe={isByMe}
              mouseHover={mouseHover}
              isReactionEnabled={isReactionEnabledInChannel}
              showFileViewer={showFileViewer}
            />
          )}
          {(getUIKitMessageType((message as FileMessage)) === messageTypes.UNKNOWN) && (
            <UnknownMessageItemBody
              className="sendbird-message-content__middle__message-item-body"
              message={message}
              isByMe={isByMe}
              mouseHover={mouseHover}
              isReactionEnabled={isReactionEnabledInChannel}
            />
          )}
          {/* reactions */}
          {(isReactionEnabledInChannel && message?.reactions?.length > 0) && (
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
        {/* thread replies */}
        {displayThreadReplies && (
          <ThreadReplies
            className="sendbird-message-content__middle__thread-replies"
            threadInfo={message?.threadInfo}
            onClick={() => onReplyInThread?.({ message: message as UserMessage | FileMessage })}
          />
        )}
      </div>
      {/* right */}
      <div className={getClassName(['sendbird-message-content__right', chainTopClassName, isReactionEnabledClassName, useReplyingClassName])}>
        {/* incoming menu */}
        {!isByMe && !isMobile && (
          <div className={getClassName(['sendbird-message-content-menu', chainTopClassName, supposedHoverClassName, isByMeClassName])}>
            {isReactionEnabledInChannel && (
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
              onReplyInThread={({ message }) => {
                if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                  onReplyInThread({ message });
                } else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                  scrollToMessage(message.parentMessage.createdAt, message.parentMessageId);
                }
              }}
            />
          </div>
        )}
      </div>
      {
        showMenu && (
          message?.isUserMessage?.() || message?.isFileMessage?.()
        ) && (
          <MobileMenu
            parentRef={contentRef}
            channel={channel}
            hideMenu={() => { setShowMenu(false); }}
            message={message}
            isReactionEnabled={isReactionEnabledInChannel}
            isByMe={isByMe}
            userId={userId}
            replyType={replyType}
            disabled={disabled}
            showRemove={showRemove}
            emojiContainer={emojiContainer}
            resendMessage={resendMessage}
            setQuoteMessage={setQuoteMessage}
            toggleReaction={toggleReaction}
            showEdit={showEdit}
            onReplyInThread={({ message }) => {
              if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                console.log('onreplyin therad is called', { onReplyInThread, message })
                onReplyInThread?.({ message });
              } else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                scrollToMessage?.(message?.parentMessage?.createdAt || 0, message?.parentMessageId || 0);
              }
            }}
          />
        )
      }
    </div>
  );
}
