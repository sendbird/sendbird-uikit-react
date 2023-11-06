import React, { Dispatch, ReactElement, SetStateAction, useContext, useRef } from 'react';
import '../index.scss';
import { getClassName, isSendableMessage, SendableMessageType } from '../../../utils';
import ContextMenu, { MenuItems } from '../../ContextMenu';
import Avatar from '../../Avatar';
import UserProfile from '../../UserProfile';
import MessageItemMenu from '../../MessageItemMenu';
import { ThreadReplySelectType } from '../../../modules/Channel/context/const';
import MessageItemReactionMenu from '../../MessageItemReactionMenu';
import { MessageContentInternalProps } from '../index';
import { UserProfileContext } from '../../../lib/UserProfileContext';

export interface MessageProfileProps extends MessageContentInternalProps {
  setSupposedHover?: Dispatch<SetStateAction<boolean>>;
  isMobile?: boolean;
  isReactionEnabledInChannel?: boolean;
  isReactionEnabledClassName?: string;
  isByMe?: boolean;
  isByMeClassName?: string;
  useReplyingClassName?: string;
  displayThreadReplies?: boolean;
  supposedHoverClassName?: string;
}

export default function MessageProfile(props: MessageProfileProps): ReactElement {
  const avatarRef = useRef(null);

  const {
    message,
    channel,
    userId,
    disabled = false,
    chainBottom = false,
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

    setSupposedHover,
    isMobile,
    isReactionEnabledInChannel,
    isReactionEnabledClassName,
    isByMe,
    isByMeClassName,
    useReplyingClassName,
    displayThreadReplies,
    supposedHoverClassName,
  } = props;

  const { disableUserProfile, renderUserProfile } = useContext(UserProfileContext);

  return (
    <div className={getClassName(['sendbird-message-content__left', isReactionEnabledClassName, isByMeClassName, useReplyingClassName])}>
      {(!isByMe && !chainBottom && isSendableMessage(message)) && (
        /** user profile */
        <ContextMenu
          menuTrigger={(toggleDropdown: () => void): ReactElement => (
            <Avatar
              className={`sendbird-message-content__left__avatar ${displayThreadReplies ? 'use-thread-replies' : ''}`}// @ts-ignore
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
        <div className={getClassName(['sendbird-message-content-menu', isReactionEnabledClassName, supposedHoverClassName, isByMeClassName])}>
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
