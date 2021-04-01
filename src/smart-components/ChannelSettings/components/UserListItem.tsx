// might move to reusable/UI

import React, { ReactElement, useRef, useContext } from 'react';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import { UserProfileContext } from '../../../lib/UserProfileContext';
import Avatar from '../../../ui/Avatar/index';
import MutedAvatarOverlay from '../../../ui/Avatar/MutedAvatarOverlay';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import UserProfile from '../../../ui/UserProfile';
import ContextMenu, { MenuItems } from '../../../ui/ContextMenu';

import './user-list-item.scss';
import { SendbirdTypes } from '../../../types';

const COMPONENT_NAME = 'sendbird-user-list-item--small';

interface ActionProps {
  actionRef: React.RefObject<HTMLInputElement>;
  parentRef: React.RefObject<HTMLInputElement>;
}

type CustomUser = SendbirdTypes['User'] & {
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
  const {
    disableUserProfile,
    renderUserProfile,
  } = useContext(UserProfileContext);
  const injectingClassNames = Array.isArray(className) ? className : [className];
  return (
    <div
      ref={parentRef}
      className={[
        COMPONENT_NAME, ...injectingClassNames,
      ].join(' ')}
    >
      {
        user.isMuted && (
          <MutedAvatarOverlay />
        )
      }
      <ContextMenu
        menuTrigger={(toggleDropdown) => (
          <Avatar
            onClick={() => {
              if (!disableUserProfile) {
                toggleDropdown();
              }
            }}
            ref={avatarRef}
            className={`${COMPONENT_NAME}__avatar`}
            src={user.profileUrl}
            width={24}
            height={24}
          />
        )}
        menuItems={(closeDropdown) => (
          <MenuItems
            openLeft
            parentRef={avatarRef}
            // for catching location(x, y) of MenuItems
            parentContainRef={avatarRef}
            // for toggling more options(menus & reactions)
            closeDropdown={closeDropdown}
            style={{ paddingTop: 0, paddingBottom: 0 }}
          >
            {
              renderUserProfile
                ? renderUserProfile({
                  user,
                  currentUserId: currentUser,
                  close: closeDropdown,
                })
                : (
                  <UserProfile
                    user={user}
                    currentUserId={currentUser}
                    onSuccess={closeDropdown}
                  />
                )
            }
          </MenuItems>
        )}
      />
      <Label
        className={`${COMPONENT_NAME}__title`}
        type={LabelTypography.SUBTITLE_1}
        color={LabelColors.ONBACKGROUND_1}
      >
        {user.nickname || stringSet.NO_NAME}
        {
          (currentUser === user.userId) && (
            " (You)"
          )
        }
      </Label>
      { // if there is now nickname, display userId
        !user.nickname && (
          <Label
            className={`${COMPONENT_NAME}__subtitle`}
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
            className={`${COMPONENT_NAME}__operator`}
            type={LabelTypography.SUBTITLE_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            Operator
          </Label>
        )
      }
      {
        action && (
          <div ref={actionRef} className={`${COMPONENT_NAME}__action`}>
            { action({ actionRef, parentRef }) }
          </div>
        )
      }
    </div>
  );
}

export default UserListItem;
