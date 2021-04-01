import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
} from 'react';

import { SendbirdTypes } from '../../../../types';

import withSendbirdContext from '../../../../lib/SendbirdSdkContext';
import { getSdk } from '../../../../lib/selectors';
import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import
  Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';

import UserListItem from '../UserListItem';
import BannedMembersModal from './BannedMembersModal';

interface Props {
  sdk: SendbirdTypes["SendBirdInstance"];
  channel: SendbirdTypes["GroupChannel"];
}

export const BannedMemberList = ({ channel }: Props): ReactElement => {
  const [members, setMembers] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!channel) {
      setMembers([]);
      return;
    }

    const bannedUserListQuery = channel.createBannedUserListQuery();
    bannedUserListQuery.next((users, error) => {
      if (error) {
        return;
      }
      setMembers(users);
      setHasNext(bannedUserListQuery.hasNext);
    });
  }, [channel]);

  const refreshList = useCallback(() => {
    if (!channel) {
      setMembers([]);
      return;
    }

    const bannedUserListQuery = channel.createBannedUserListQuery();
    bannedUserListQuery.next(function(users, error) {
      if (error) {
        return;
      }
      setMembers(users);
      setHasNext(bannedUserListQuery.hasNext);
    });
  }, [channel]);
  return (
    <>
      {
        members.map((member) => (
          <UserListItem
            key={member.userId}
            user={member}
            action={({ actionRef, parentRef }) => {
              return (
                <ContextMenu
                  menuTrigger={(toggleDropdown) => (
                    <IconButton
                      className="sendbird-user-message__more__menu"
                      width="32px"
                      height="32px"
                      onClick={toggleDropdown}
                    >
                      <Icon
                        width="24px"
                        height="24px"
                        type={IconTypes.MORE}
                        fillColor={IconColors.CONTENT_INVERSE}
                      />
                    </IconButton>
                  )}
                  menuItems={(closeDropdown) => (
                    <MenuItems
                      parentContainRef={parentRef}
                      parentRef={actionRef} // for catching location(x, y) of MenuItems
                      closeDropdown={closeDropdown}
                      openLeft
                    >
                      <MenuItem
                        onClick={() => {
                          channel.unbanUser(member, () => {
                            closeDropdown();
                            refreshList();
                          })
                        }}
                      >
                        Unban
                      </MenuItem>
                    </MenuItems>
                  )}
                />
              )
            }}
          />
        ))
      }
      {
        members && members.length === 0 && (
          <Label
            className="sendbird-channel-settings__empty-list"
            type={LabelTypography.SUBTITLE_2}
            color={LabelColors.ONBACKGROUND_3}
          >
            No banned members yet
          </Label>
        )
      }
      {
        hasNext && (
          <div
            className="sendbird-channel-settings-accordion__footer"
          >
            <Button
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={() => {
                setShowModal(true);
              }}
            >
              All banned members
            </Button>
          </div>
        )
      }
      {
        showModal && (
          <BannedMembersModal
            channel={channel}
            hideModal={() => {
              setShowModal(false);
              refreshList();
            }}
          />
        )
      }
    </>
  );
}

const mapStoreToProps = (store) => ({
  sdk: getSdk(store),
});

export default withSendbirdContext(BannedMemberList, mapStoreToProps);
