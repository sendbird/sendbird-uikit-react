import React, { ReactElement, useRef, useContext } from 'react';
import { User } from '@sendbird/chat';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { UserProfileContext } from '../../../../lib/UserProfileContext';
import Avatar from '../../../../ui/Avatar/index';
import MutedAvatarOverlay from '../../../../ui/Avatar/MutedAvatarOverlay';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import UserProfile from '../../../../ui/UserProfile';
import ContextMenu, { MenuItems } from '../../../../ui/ContextMenu';

import './user-list-item.scss';

interface ActionProps {
  actionRef: React.RefObject<HTMLInputElement>;
  parentRef: React.RefObject<HTMLInputElement>;
}

type CustomUser = User & {
  isMuted: boolean;
  role: string;
};

interface Props {
  user: CustomUser;
  currentUser?: string;
  className?: string;
  action?(props: ActionProps): ReactElement;
}

const UserListItem = ({
  user,
  className,
  currentUser,
  action,
}: Props): ReactElement => {
  const actionRef = useRef(null);
  const parentRef = useRef(null);
  const avatarRef = useRef(null);
  const { stringSet } = useContext(LocalizationContext);
  const { disableUserProfile, renderUserProfile } = useContext(UserProfileContext);
  const injectingClassNames = Array.isArray(className) ? className : [className];
  return (
    <div
      ref={parentRef}
      className={[
        'sendbird-user-list-item--small', ...injectingClassNames,
      ].join(' ')}
    >
      <ContextMenu
        menuTrigger={(toggleDropdown) => (
          <>
            <Avatar
              onClick={() => {
                if (!disableUserProfile) {
                  toggleDropdown();
                }
              }}
              ref={avatarRef}
              className="sendbird-user-list-item--small__avatar"
              src={user.profileUrl}
              width={24}
              height={24}
            />
            {
              user.isMuted && (
                <MutedAvatarOverlay />
              )
            }
          </>
        )}
        menuItems={(closeDropdown) => (
          renderUserProfile
            ? renderUserProfile({
              user,
              currentUserId: currentUser ?? '',
              close: closeDropdown,
              avatarRef,
            })
            : (
              <MenuItems
                openLeft
                parentRef={avatarRef}
                // for catching location(x, y) of MenuItems
                parentContainRef={avatarRef}
                // for toggling more options(menus & reactions)
                closeDropdown={closeDropdown}
                style={{ paddingTop: '0px', paddingBottom: '0px' }}
              >
                <UserProfile
                  user={user}
                  currentUserId={currentUser}
                  onSuccess={closeDropdown}
                />
              </MenuItems>
            )
        )}
      />
      {/* {
        user.isMuted && (
          <MutedAvatarOverlay />
        )
      } */}
      <Label
        className="sendbird-user-list-item--small__title"
        type={LabelTypography.SUBTITLE_1}
        color={LabelColors.ONBACKGROUND_1}
      >
        {user.nickname || stringSet.NO_NAME}
        {
          (currentUser === user.userId) && (
            stringSet.CHANNEL_SETTING__MEMBERS__YOU
          )
        }
      </Label>
      { // if there is now nickname, display userId
        !user.nickname && (
          <Label
            className="sendbird-user-list-item--small__subtitle"
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {user.userId}
          </Label>
        )
      }
      {
        user.role === 'operator' && (
          <Label
            className="sendbird-user-list-item--small__operator"
            type={LabelTypography.SUBTITLE_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {stringSet.CHANNEL_SETTING__MEMBERS__OPERATOR}
          </Label>
        )
      }
      {
        action && (
          <div ref={actionRef} className="sendbird-user-list-item--small__action">
            {action({ actionRef, parentRef })}
          </div>
        )
      }
    </div>
  );
};

export default UserListItem;
