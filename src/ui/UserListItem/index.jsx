import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { UserProfileContext } from '../../lib/UserProfileContext';
import { LocalizationContext } from '../../lib/LocalizationContext';
import Avatar from '../Avatar/index';
import MutedAvatarOverlay from '../Avatar/MutedAvatarOverlay';
import Checkbox from '../Checkbox';
import UserProfile from '../UserProfile';
import ContextMenu, { MenuItems } from '../ContextMenu';
import Label, { LabelTypography, LabelColors } from '../Label';

import './index.scss';

export default function UserListItem({
  className,
  user,
  checkBox,
  disableMessaging,
  currentUser,
  checked,
  onChange,
  action,
}) {
  const uniqueKey = user.userId;
  const actionRef = React.useRef(null);
  const parentRef = React.useRef(null);
  const avatarRef = React.useRef(null);
  const {
    disableUserProfile,
    renderUserProfile,
  } = useContext(UserProfileContext);
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-user-list-item',
      ].join(' ')}
      ref={parentRef}
    >
      {
        user.isMuted && (
          <MutedAvatarOverlay height={40} width={40} />
        )
      }
      <ContextMenu
        menuTrigger={(toggleDropdown) => (
          <Avatar
            className="sendbird-user-list-item__avatar"
            ref={avatarRef}
            src={user.profileUrl}
            width="40px"
            height="40px"
            onClick={() => {
              if (!disableUserProfile) {
                toggleDropdown();
              }
            }}
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
                    disableMessaging={disableMessaging}
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
        className="sendbird-user-list-item__title"
        type={LabelTypography.SUBTITLE_1}
        color={LabelColors.ONBACKGROUND_1}
      >
        {user.nickname || stringSet.NO_NAME}
        {
          (currentUser === user.userId) && (
            ' (You)'
          )
        }
      </Label>
      { // if there is now nickname, display userId
        !user.nickname && (
          <Label
            className="sendbird-user-list-item__subtitle"
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {user.userId}
          </Label>
        )
      }
      {
        checkBox && (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label
            className="sendbird-user-list-item__checkbox"
            htmlFor={uniqueKey}
          >
            <Checkbox
              id={uniqueKey}
              checked={checked}
              onChange={(event) => onChange(event)}
            />
          </label>
        )
      }
      {
        user.role === 'operator' && (
          <Label
            className="sendbird-user-list-item__operator"
            type={LabelTypography.SUBTITLE_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            Operator
          </Label>
        )
      }
      {
        action && (
          <div
            className="sendbird-user-list-item__action"
            ref={actionRef}
          >
            { action({ actionRef, parentRef })}
          </div>
        )
      }
    </div>
  );
}

UserListItem.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  user: PropTypes.shape({
    userId: PropTypes.string,
    role: PropTypes.string,
    isMuted: PropTypes.bool,
    nickname: PropTypes.string,
    profileUrl: PropTypes.string,
  }).isRequired,
  disableMessaging: PropTypes.bool,
  currentUser: PropTypes.string,
  action: PropTypes.element,
  checkBox: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

UserListItem.defaultProps = {
  className: '',
  currentUser: '',
  checkBox: false,
  disableMessaging: false,
  checked: false,
  action: null,
  onChange: () => { },
};
