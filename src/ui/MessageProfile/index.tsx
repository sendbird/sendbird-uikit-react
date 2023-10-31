import React, {ReactElement, useContext, useRef, useState} from 'react';
import './index.scss';
import {CoreMessageType, getClassName, isSendableMessage, SendableMessageType} from '../../utils';
import ContextMenu, {MenuItems} from '../ContextMenu';
import Avatar from '../Avatar';
import UserProfile from '../UserProfile';
import MessageItemMenu from '../MessageItemMenu';
import {ThreadReplySelectType} from '../../modules/Channel/context/const';
import MessageItemReactionMenu from '../MessageItemReactionMenu';
import {UserProfileContext} from '../../lib/UserProfileContext';
import {useMediaQueryContext} from '../../lib/MediaQueryContext';
import {MessageContentProps} from '../MessageContent';
import {Nullable} from '../../types';
import {GroupChannel} from '@sendbird/chat/groupChannel';

export interface MessageProfileClassNameProps {
  profileContainerClassName: string;
  profileAvatarClassName: string;
  profileMenuClassName: string;
}

export interface MessageProfileForMessageContentProps {
  profileContainerClassName: string;
}
export interface MessageProfileProps {
  message: CoreMessageType;
  channel: Nullable<GroupChannel>;
  messageContentProps?: MessageContentProps; // classNames
  messageProfileClassNameProps?: MessageProfileClassNameProps;
}

export default function MessageProfile({
  message,
  channel,
  messageContentProps,
  messageProfileClassNameProps,
}: MessageProfileProps): ReactElement {
  const avatarRef = useRef(null);

  if (!messageContentProps) {
    return (
      <div className={'profile-container__incoming'}>
        {isSendableMessage(message) && (
          /** user profile */
          <Avatar
            className={'profile-container__avatar'}
            // @ts-ignore
            src={channel?.members?.find((member) => member?.userId === message.sender.userId)?.profileUrl || message.sender.profileUrl || ''}
            // TODO: Divide getting profileUrl logic to utils
            ref={avatarRef}
            width="28px"
            height="28px"
          />
        )}
      </div>
    );
  }

  const {
    userId,
    disabled = false,
    chainBottom = false,
    isReactionEnabled = false,
    disableQuoteMessage = false,
    replyType,
    threadReplySelectType,
    emojiContainer,
    scrollToMessage,
    showEdit,
    showRemove,
    resendMessage,
    toggleReaction,
    setQuoteMessage,
    onReplyInThread,
  } = messageContentProps;

  const { disableUserProfile, renderUserProfile } = useContext(UserProfileContext);
  const [supposedHover, setSupposedHover] = useState(false);
  const { isMobile } = useMediaQueryContext();

  const isReactionEnabledInChannel = isReactionEnabled && !channel?.isEphemeral;
  const isReactionEnabledClassName = isReactionEnabledInChannel ? 'use-reactions' : '';
  const isByMe = (userId === (message as SendableMessageType)?.sender?.userId)
    || ((message as SendableMessageType)?.sendingStatus === 'pending')
    || ((message as SendableMessageType)?.sendingStatus === 'failed');
  const useReplying = !!((replyType === 'QUOTE_REPLY' || replyType === 'THREAD')
    && message?.parentMessageId && message?.parentMessage
    && !disableQuoteMessage
  );
  const useReplyingClassName = useReplying ? 'use-quote' : '';
  const displayThreadReplies = message?.threadInfo?.replyCount > 0 && replyType === 'THREAD';
  const supposedHoverClassName = supposedHover ? 'sendbird-mouse-hover' : '';

  const {
    profileContainerClassName,
    profileAvatarClassName,
    profileMenuClassName,
  } = messageProfileClassNameProps;

  return (
    <div className={profileContainerClassName ?? getClassName([
      `profile-container__${isByMe ? 'outgoing' : 'incoming'}`,
      isReactionEnabledClassName,
      useReplyingClassName,
    ])}>
      {(!isByMe && !chainBottom && isSendableMessage(message)) && (
        /** user profile */
        <ContextMenu
          menuTrigger={(toggleDropdown: () => void): ReactElement => (
            <Avatar
              className={profileAvatarClassName ?? `profile-container__avatar ${displayThreadReplies ? 'use-thread-replies' : ''}`}
              // @ts-ignore
              src={channel?.members?.find((member) => member?.userId === message.sender.userId)?.profileUrl || message.sender.profileUrl || ''}
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
                ? renderUserProfile({ user: message.sender, close: closeDropdown, currentUserId: userId })
                : (<UserProfile user={message.sender} onSuccess={closeDropdown} />)
              }
            </MenuItems>
          )}
        />
      )}
      {/* outgoing menu */}
      {isByMe && !isMobile && (
        <div className={profileMenuClassName ?? getClassName(['profile-menu', supposedHoverClassName])}>
          <MessageItemMenu
            channel={channel}
            message={message as SendableMessageType}
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
                scrollToMessage(message.parentMessage?.createdAt, message.parentMessageId);
              }
            }}
          />
          {isReactionEnabledInChannel && (
            <MessageItemReactionMenu
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
  );
}
