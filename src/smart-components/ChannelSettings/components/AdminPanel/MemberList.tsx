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

import UserListItem from '../UserListItem';
import MembersModal from './MembersModal';
import InviteMembers from './InviteMembersModal';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelSettings } from '../../context/ChannelSettingsProvider';
import uuidv4 from '../../../../utils/uuid';

export const MemberList = (): ReactElement => {
  const [members, setMembers] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showInviteMembers, setShowInviteMembers] = useState(false);

  const state = useSendbirdStateContext();
  const {
    channel,
    setChannelUpdateId,
  } = useChannelSettings();

  const sdk = state?.stores?.sdkStore?.sdk;
  const userId = state?.config?.userId;

  useEffect(() => {
    if (!channel) {
      setMembers([]);
      return;
    }

    const memberUserListQuery = channel.createMemberListQuery();
    memberUserListQuery.limit = 10;
    memberUserListQuery.next((members, error) => {
      if (error) {
        return;
      }
      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel]);

  const refershList = useCallback(
    () => {
      if (!channel) {
        setMembers([]);
        return;
      }
      const memberUserListQuery = channel.createMemberListQuery();
      memberUserListQuery.limit = 10;
      memberUserListQuery.next((members, error) => {
        if (error) {
          return;
        }
        setMembers(members);
        setHasNext(memberUserListQuery.hasNext);
        setChannelUpdateId(uuidv4());
      });
    },
    [channel],
  );

  return (
    <>
      {
        members.map((member) => (
          <UserListItem
            key={member.userId}
            user={member}
            currentUser={sdk.currentUser.userId}
            action={
              (userId !== member.userId)
                ? ({ actionRef, parentRef }) => (
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
                            if ((member.role !== 'operator')) {
                              channel.addOperators([member.userId], () => {
                                refershList();
                                closeDropdown();
                              });
                            } else {
                              channel.removeOperators([member.userId], () => {
                                refershList();
                                closeDropdown();
                              });
                            }
                          }}
                        >
                          {member.role !== 'operator' ? 'Promote to operator' : 'Demote operator'}
                        </MenuItem>
                        {
                          // No muted members in broadcast channel
                          !channel.isBroadcast && (
                            <MenuItem
                              onClick={() => {
                                if (member.isMuted) {
                                  channel.unmuteUser(member, () => {
                                    refershList();
                                    closeDropdown();
                                  })
                                } else {
                                  channel.muteUser(member, () => {
                                    refershList();
                                    closeDropdown();
                                  });
                                }
                              }}
                            >
                              { member.isMuted ? 'Unmute' : 'Mute'}
                            </MenuItem>
                          )
                        }
                        <MenuItem
                          onClick={() => {
                            channel.banUser(member, -1, '', () => {
                              refershList();
                              closeDropdown();
                            });
                          }}
                        >
                          Ban
                    </MenuItem>
                      </MenuItems>
                    )}
                  />
                )
                : null
            }
          />
        ))
      }
      <div
        className="sendbird-channel-settings-accordion__footer"
      >
        {
          hasNext && (
            <Button
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={() => setShowAllMembers(true)}
            >
              All members
            </Button>
          )
        }
        <Button
          type={ButtonTypes.SECONDARY}
          size={ButtonSizes.SMALL}
          onClick={() => setShowInviteMembers(true)}
        >
          Invite members
        </Button>
      </div>
      {
        showAllMembers && (
          <MembersModal
            onCancel={() => {
              setShowAllMembers(false);
              refershList();
            }}
          />
        )
      }
      {
        showInviteMembers && (
          <InviteMembers
            onSubmit={() => {
              setShowInviteMembers(false);
              refershList();
            }}
            onCancel={() => setShowInviteMembers(false)}
          />
        )
      }
    </>
  );
}

export default MemberList;
