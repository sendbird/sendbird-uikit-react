import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';

import './members-accordion.scss';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import { UserProfileContext } from '../../../lib/UserProfileContext';
import Button, { ButtonTypes, ButtonSizes } from '../../../ui/Button';
import Avatar from '../../../ui/Avatar/index';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import InviteMembers from '../../InviteMembers';
import MembersModal from './AdminPanel/MembersModal';
import UserProfile from '../../../ui/UserProfile';
import ContextMenu, { MenuItems } from '../../../ui/ContextMenu';

const SHOWN_MEMBER_MAX = 10;

const UserListItem = ({ member = {}, currentUser = '' }) => {
  const avatarRef = useRef(null);
  const {
    disableUserProfile,
    renderUserProfile,
  } = useContext(UserProfileContext);
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className="sendbird-members-accordion__member">
      <div className="sendbird-members-accordion__member-avatar">
        <ContextMenu
          menuTrigger={(toggleDropdown) => (
            <Avatar
              onClick={() => {
                if (!disableUserProfile) {
                  toggleDropdown();
                }
              }}
              ref={avatarRef}
              src={member.profileUrl}
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
                    user: member,
                    currentUserId: currentUser,
                    close: closeDropdown,
                  })
                  : (
                    <UserProfile
                      user={member}
                      currentUserId={currentUser}
                      onSuccess={closeDropdown}
                    />
                  )
              }
            </MenuItems>
          )}
        />
      </div>
      <Label type={LabelTypography.SUBTITLE_2} color={LabelColors.ONBACKGROUND_1}>
        {member.nickname || stringSet.NO_NAME}
        {
          (currentUser === member.userId) && (
            stringSet.YOU
          )
        }
      </Label>
    </div>
  );
};

UserListItem.propTypes = {
  member: PropTypes.shape({
    userId: PropTypes.string,
    profileUrl: PropTypes.string,
    nickname: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.string.isRequired,
};

const MembersAccordion = ({
  channel,
  disabled,
  currentUser,
  userQueryCreator,
  onInviteMembers,
  swapParams,
}) => {
  const members = channel.members || [];
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className="sendbird-members-accordion">
      <div className="sendbird-members-accordion__list">
        {
          members.slice(0, SHOWN_MEMBER_MAX).map((member) => (
            <UserListItem
              member={member}
              currentUser={currentUser}
              key={member.userId}
            />
          ))
        }
      </div>
      <div className="sendbird-members-accordion__footer">
        {
          members.length >= SHOWN_MEMBER_MAX && (
            <Button
              className="sendbird-members-accordion__footer__all-members"
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={() => setShowMoreModal(true)}
            >
              {stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS}
            </Button>
          )
        }
        {
          members.length >= SHOWN_MEMBER_MAX && showMoreModal && (
            <MembersModal
              currentUser={currentUser}
              hideModal={() => {
                setShowMoreModal(false);
              }}
              channel={channel}
            />
          )
        }
        <Button
          className="sendbird-members-accordion__footer__invite-users"
          type={ButtonTypes.SECONDARY}
          size={ButtonSizes.SMALL}
          disabled={disabled}
          onClick={() => {
            if (disabled) { return; }
            setShowAddUserModal(true);
          }}
        >
          {stringSet.CHANNEL_SETTING__MEMBERS__INVITE_MEMBER}
        </Button>
        {
          showAddUserModal && (
            <InviteMembers
              swapParams={swapParams}
              titleText={stringSet.MODAL__INVITE_MEMBER__TITLE}
              submitText={stringSet.BUTTON__INVITE}
              closeModal={() => setShowAddUserModal(false)}
              idsToFilter={members.map((member) => (member.userId))}
              userQueryCreator={userQueryCreator}
              onSubmit={onInviteMembers}
            />
          )
        }
      </div>
    </div>
  );
};

MembersAccordion.propTypes = {
  swapParams: PropTypes.bool,
  disabled: PropTypes.bool,
  channel: PropTypes.shape({
    members: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  currentUser: PropTypes.string,
  userQueryCreator: PropTypes.func.isRequired,
  onInviteMembers: PropTypes.func.isRequired,
};

MembersAccordion.defaultProps = {
  swapParams: false,
  currentUser: '',
  disabled: false,
  channel: {},
};

export default MembersAccordion;
