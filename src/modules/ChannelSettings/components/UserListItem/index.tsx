import React, { ReactElement, useRef, useContext, ReactNode } from 'react';
import { User } from '@sendbird/chat';
import { type GroupChannel, Member } from '@sendbird/chat/groupChannel';

import './user-list-item.scss';

import { useSendbirdStateContext } from '../../../../lib/Sendbird';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { UserProfileContext } from '../../../../lib/UserProfileContext';

import Avatar from '../../../../ui/Avatar/index';
import MutedAvatarOverlay from '../../../../ui/Avatar/MutedAvatarOverlay';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import UserProfile from '../../../../ui/UserProfile';
import ContextMenu, { MenuItems } from '../../../../ui/ContextMenu';
import { UserListItemMenuProps } from '../../../../ui/UserListItemMenu/UserListItemMenu';

interface ActionProps {
  actionRef: React.RefObject<HTMLInputElement>;
  parentRef: React.RefObject<HTMLInputElement>;
}

interface Props {
  user: User | Member;
  channel: GroupChannel;
  /** @deprecated Doesn't need to fill this props */
  currentUser?: string;
  className?: string;
  /** @deprecated Use the props `renderListItemMenu` instead */
  action?(props: ActionProps): ReactNode;
  renderListItemMenu?: (props: UserListItemMenuProps) => ReactNode;
}

/**
 * This UserListItem component is usually used in the ChannelSettings.
 * There's another UserListItem which is used in the modal. (ui/UserListItem)
 */
const UserListItem = ({
  user,
  channel,
  className = '',
  action,
  renderListItemMenu,
}: Props): ReactElement => { const { config } = useSendbirdStateContext();
  const currentUser = config.userId;
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
      {/* UserProfile */}
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
            {user instanceof Member && user.isMuted && (
              <MutedAvatarOverlay />
            )}
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
        user instanceof Member && user.role === 'operator' && (
          <Label
            className="sendbird-user-list-item--small__operator"
            type={LabelTypography.SUBTITLE_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {stringSet.CHANNEL_SETTING__MEMBERS__OPERATOR}
          </Label>
        )
      }
      {/* Deprecated logic */}
      {(!renderListItemMenu && action) && (
        <div ref={actionRef} className="sendbird-user-list-item--small__action">
          {action({ actionRef, parentRef })}
        </div>
      )}
      {renderListItemMenu && (
        <div ref={actionRef} className="sendbird-user-list-item--small__action">
          {renderListItemMenu({ channel, user })}
        </div>
      )}
    </div>
  );
};

export default UserListItem;
