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
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';

import UserListItem from '../UserListItem';
import MembersModal from './MembersModal';
import InviteMembers from './InviteMembersModal';

interface Props {
  sdk: SendbirdTypes['SendBirdInstance'];
  channel: SendbirdTypes['GroupChannel'];
  userQueryCreator(): SendbirdTypes['UserListQuery'];
  userId: string;
}

export const MemberList = ({
  sdk,
  channel,
  userQueryCreator,
  userId,
}: Props): ReactElement => {
  const [members, setMembers] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showInviteMembers, setShowInviteMembers] = useState(false);

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
            currentUser={sdk.currentUser.userId}
            channel={channel}
            hideModal={() => {
              setShowAllMembers(false);
              refershList();
            }}
          />
        )
      }
      {
        showInviteMembers && (
          <InviteMembers
            userQueryCreator={userQueryCreator}
            onSubmit={(selectedMembers: Array<string>) => {
              channel.inviteWithUserIds(selectedMembers, () => {
                setShowInviteMembers(false);
                refershList();
              });
            }}
            channel={channel}
            hideModal={() => setShowInviteMembers(false)}
          />
        )
      }
    </>
  );
}

const mapStoreToProps = (store) => ({
  sdk: getSdk(store),
});

export default withSendbirdContext(MemberList, mapStoreToProps);
