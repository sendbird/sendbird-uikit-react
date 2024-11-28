import React, { ChangeEvent, MutableRefObject, ReactElement, ReactNode, useRef } from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import './index.scss';

import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { useUserProfileContext } from '../../lib/UserProfileContext';
import { useLocalization } from '../../lib/LocalizationContext';

import Avatar from '../Avatar/index';
import MutedAvatarOverlay from '../Avatar/MutedAvatarOverlay';
import Checkbox from '../Checkbox';
import UserProfile from '../UserProfile';
import ContextMenu, { MenuItems } from '../ContextMenu';
import Label, { LabelTypography, LabelColors } from '../Label';
import { UserListItemMenuProps } from '../UserListItemMenu/UserListItemMenu';
import { classnames } from '../../utils/utils';
import pxToNumber from '../../utils/pxToNumber';

export interface UserListItemProps {
  user: User | Member;
  channel?: GroupChannel;
  className?: string;
  checked?: boolean;
  checkBox?: boolean;
  isOperator?: boolean;
  disabled?: boolean;
  disableMessaging?: boolean;
  /** @deprecated Doesn't need to fill this props */
  currentUser?: string;
  /** @deprecated Use the props `renderListItemMenu` instead */
  action?({ actionRef, parentRef }: { actionRef: MutableRefObject<any>, parentRef?: MutableRefObject<any> }): ReactElement;
  onChange?(e: ChangeEvent<HTMLInputElement>): void;
  avatarSize?: string;
  /** @deprecated Please use the onUserAvatarClick instead */
  onClick?(): void;
  onUserAvatarClick?(): void;
  renderListItemMenu?: (props: UserListItemMenuProps) => ReactNode;
  size?: 'normal' | 'small';
}

export function UserListItem({
  user,
  channel,
  className = undefined,
  checked,
  checkBox,
  isOperator,
  disabled,
  disableMessaging,
  action,
  onChange,
  avatarSize = '40px',
  onClick,
  onUserAvatarClick,
  renderListItemMenu,
  size = 'normal',
}: UserListItemProps): ReactElement {
  const operator = isOperator ?? (user as Member)?.role === 'operator';
  const uniqueKey = user.userId;
  const actionRef = useRef(null);
  const parentRef = useRef(null);
  const avatarRef = useRef(null);
  const { disableUserProfile, renderUserProfile } = useUserProfileContext();
  const { stringSet } = useLocalization();
  const { config } = useSendbirdStateContext();
  const currentUser = config.userId;

  const itemClassName = size === 'small' ? 'sendbird-user-list-item--small' : 'sendbird-user-list-item';
  const avatarClassName = size === 'small' ? 'sendbird-user-list-item--small__avatar' : 'sendbird-user-list-item__avatar';
  const titleClassName = size === 'small' ? 'sendbird-user-list-item--small__title' : 'sendbird-user-list-item__title';
  const subtitleClassName = size === 'small' ? 'sendbird-user-list-item--small__subtitle' : 'sendbird-user-list-item__subtitle';
  const checkboxClassName = size === 'small' ? 'sendbird-user-list-item--small__checkbox' : 'sendbird-user-list-item__checkbox';
  const actionClassName = size === 'small' ? 'sendbird-user-list-item--small__action' : 'sendbird-user-list-item__action';
  const operatorClassName = size === 'small' ? 'sendbird-user-list-item--small__operator' : 'sendbird-user-list-item__operator';

  return (
    <div
      className={classnames(itemClassName, ...(Array.isArray(className) ? className : [className]))}
      ref={parentRef}
    >

      <ContextMenu
        menuTrigger={(toggleDropdown) => (
          <>
            <Avatar
              className={avatarClassName}
              ref={avatarRef}
              src={user?.profileUrl || user?.plainProfileUrl || ''}
              width={avatarSize}
              height={avatarSize}
              onClick={() => {
                if (!disableUserProfile) {
                  toggleDropdown();
                  (onUserAvatarClick ?? onClick)?.();
                }
              }}
            />
            {(user as Member)?.isMuted && (
              <MutedAvatarOverlay height={pxToNumber(avatarSize)} width={pxToNumber(avatarSize)} />
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
                parentContainRef={avatarRef}
                closeDropdown={closeDropdown}
                style={{ paddingTop: '0px', paddingBottom: '0px' }}
              >
                <UserProfile
                  disableMessaging={disableMessaging}
                  user={user}
                  currentUserId={currentUser}
                  onSuccess={closeDropdown}
                />
              </MenuItems>
            )
        )}
      />
      <Label
        className={titleClassName}
        type={LabelTypography.SUBTITLE_1}
        color={LabelColors.ONBACKGROUND_1}
      >
        {user.nickname || stringSet.NO_NAME}
        {(currentUser === user.userId) && (
          stringSet.CHANNEL_SETTING__MEMBERS__YOU
        )}
      </Label>
      {!user.nickname && (
        <Label
          className={subtitleClassName}
          type={LabelTypography.CAPTION_3}
          color={LabelColors.ONBACKGROUND_2}
        >
          {user.userId}
        </Label>
      )}
      {checkBox && (
        <label
          className={checkboxClassName}
          htmlFor={uniqueKey}
        >
          <Checkbox
            id={uniqueKey}
            checked={checked}
            disabled={disabled}
            onChange={(event) => onChange?.(event)}
          />
        </label>
      )}
      {operator && (
        <Label
          className={classnames(operatorClassName, checkBox && 'checkbox')}
          type={LabelTypography.SUBTITLE_2}
          color={LabelColors.ONBACKGROUND_2}
        >
          {stringSet.LABEL__OPERATOR}
        </Label>
      )}
      {!checkBox && !renderListItemMenu && action && (
        <div
          className={actionClassName}
          ref={actionRef}
        >
          {action({ actionRef, parentRef })}
        </div>
      )}
      {!checkBox && renderListItemMenu && (
        <div
          className={actionClassName}
          ref={actionRef}
        >
          {renderListItemMenu({ channel, user })}
        </div>
      )}
    </div>
  );
}

export default UserListItem;
