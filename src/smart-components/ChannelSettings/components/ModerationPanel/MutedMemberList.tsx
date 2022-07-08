import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
} from 'react';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';
import
  Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';
import UserListItem from '../UserListItem';
import MutedMembersModal from './MutedMembersModal';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';


export const MutedMemberList = (): ReactElement => {
  const [members, setMembers] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { channel } = useChannelSettingsContext();
  const state = useSendbirdStateContext();
  const currentUser = state?.config?.userId;

  useEffect(() => {
    if (!channel) {
      setMembers([]);
      return;
    }

    const memberUserListQuery = channel?.createMemberListQuery({
      limit: 10,
      // @ts-ignore
      mutedMemberFilter: 'muted',
    });
    memberUserListQuery.next().then((members) => {
      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel]);

  const refreshList = useCallback(() => {
    if (!channel) {
      setMembers([]);
      return;
    }

    const memberUserListQuery = channel?.createMemberListQuery({
      limit: 10,
      // @ts-ignore
      mutedMemberFilter: 'muted',
    });
    memberUserListQuery.next().then((members) => {
      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel]);
  return (
    <>
      {
        members.map((member) => (
          <UserListItem
            key={member.userId}
            user={member}
            currentUser={currentUser}
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
                      closeDropdown={closeDropdown}
                      openLeft
                      parentContainRef={parentRef}
                      parentRef={actionRef} // for catching location(x, y) of MenuItems
                    >
                      <MenuItem
                        onClick={() => {
                          channel?.unmuteUser(member).then(() => {
                            refreshList();
                            closeDropdown();
                          })
                        }}
                      >
                        Unmute
                      </MenuItem>
                    </MenuItems>
                  )}
                />
              );
            }
            }
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
            No muted members yet
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
              All muted members
            </Button>
          </div>
        )
      }
      {
        showModal && (
          <MutedMembersModal
            onCancel={() => {
              setShowModal(false);
              refreshList();
            }}
          />
        )
      }
    </>
  );
}

export default MutedMemberList;
