import React, { ReactElement, useRef } from 'react';
import '../index.scss';
import { isSendableMessage } from '../../../utils';
import ContextMenu, { MenuItems } from '../../ContextMenu';
import Avatar from '../../Avatar';
import UserProfile from '../../UserProfile';
import { MessageContentProps } from '../index';
import { useUserProfileContext } from '../../../lib/UserProfileContext';
import { classnames } from '../../../utils/utils';

export interface MessageProfileProps extends MessageContentProps {
  className?: string;
  isByMe?: boolean;
  displayThreadReplies?: boolean;
  bottom?: string
}

export function MessageProfile({
  // Internal props
  className = '',
  isByMe,
  displayThreadReplies,
  bottom,
  // MessageContentProps
  message,
  channel,
  userId,
  chainBottom = false,
}: MessageProfileProps) {
  const avatarRef = useRef(null);

  const { disableUserProfile, renderUserProfile } = useUserProfileContext();

  if (isByMe || chainBottom || !isSendableMessage(message)) {
    return null;
  }

  return (
    <ContextMenu
      menuTrigger={(toggleDropdown: () => void): ReactElement => (
        <Avatar
          className={classnames(className, displayThreadReplies && 'use-thread-replies')}
          src={
            channel?.members?.find((member) => member?.userId === message.sender.userId)?.profileUrl
            || message.sender.profileUrl
            || ''
          }
          // TODO: Divide getting profileUrl logic to utils
          ref={avatarRef}
          width="28px"
          height="28px"
          bottom={bottom}
          onClick={(): void => {
            if (!disableUserProfile) toggleDropdown();
          }}
        />
      )}
      menuItems={(closeDropdown) => (
        renderUserProfile ? (
          renderUserProfile({
            user: message.sender,
            close: closeDropdown,
            currentUserId: userId,
            avatarRef,
          })
        ) : (
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
            <UserProfile user={message.sender} onSuccess={closeDropdown} />
          </MenuItems>
        )
      )}
    />
  );
}

export default MessageProfile;
