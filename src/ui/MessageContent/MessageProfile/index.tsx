import React, {
  ReactElement,
  useContext,
  useRef,
} from 'react';
import '../index.scss';
import { isSendableMessage } from '../../../utils';
import ContextMenu, { MenuItems } from '../../ContextMenu';
import Avatar from '../../Avatar';
import UserProfile from '../../UserProfile';
import { MessageContentProps } from '../index';
import { UserProfileContext } from '../../../lib/UserProfileContext';

export interface MessageProfileProps extends MessageContentProps {
  isByMe?: boolean;
  displayThreadReplies?: boolean;
  bottom?: string
}

export default function MessageProfile(
  props: MessageProfileProps,
): ReactElement {
  const {
    message,
    channel,
    userId,
    chainBottom = false,
    isByMe,
    displayThreadReplies,
    bottom,
  } = props;
  const avatarRef = useRef(null);

  const { disableUserProfile, renderUserProfile } = useContext(UserProfileContext);

  if (isByMe || chainBottom || !isSendableMessage(message)) {
    return null;
  }

  return (
    <ContextMenu
      menuTrigger={(toggleDropdown: () => void): ReactElement => (
        <Avatar
          className={`sendbird-message-content__left__avatar ${displayThreadReplies ? 'use-thread-replies' : ''
          }`} // @ts-ignore
          src={
            channel?.members?.find(
              (member) => member?.userId === message.sender.userId,
            )?.profileUrl
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
