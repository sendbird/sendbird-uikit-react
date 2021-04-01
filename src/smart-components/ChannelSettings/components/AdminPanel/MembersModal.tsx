import React, {
  ReactElement,
  useEffect,
  useState,
} from 'react'

import { SendbirdTypes } from '../../../../types';

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';
import { noop } from '../../../../utils/utils';

interface Props {
  hideModal(): void;
  currentUser?: string;
  channel: SendbirdTypes["GroupChannel"];
}

export default function MembersModal({
  hideModal,
  channel,
  currentUser,
}: Props): ReactElement {
  const [members, setMembers] = useState([]);
  const [memberQuery, setMemberQuery] = useState(null);

  useEffect(() => {
    const memberListQuery = channel.createMemberListQuery();
    memberListQuery.limit = 20;
    memberListQuery.next((members, error) => {
      if (error) {
        return;
      }
      setMembers(members);
    });
    setMemberQuery(memberListQuery);
  }, [])
  return (
    <div>
      <Modal
        hideFooter
        onCancel={() => hideModal()}
        onSubmit={noop}
        titleText="All Members"
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={(e) => {
            const { hasNext } = memberQuery;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              memberQuery.next((o, error) => {
                if (error) {
                  return;
                }
                setMembers([
                  ...members,
                  ...o,
                ])
              });
            }
          }}
        >
          { members.map((member) => (
            <UserListItem
              user={member}
              key={member.userId}
              currentUser={currentUser}
              action={({ parentRef, actionRef }) => (
                <>
                  {channel.myRole === 'operator' && (
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
                                  setMembers(members.map(m => {
                                    if(m.userId === member.userId) {
                                      return {
                                        ...member,
                                        role: 'operator',
                                      };
                                    }
                                    return m;
                                  }));
                                  closeDropdown();
                                });
                              } else {
                                channel.removeOperators([member.userId], () => {
                                  setMembers(members.map(m => {
                                    if(m.userId === member.userId) {
                                      return {
                                        ...member,
                                        role: '',
                                      };
                                    }
                                    return m;
                                  }));
                                  closeDropdown();
                                });
                              }
                            }}
                          >
                            { member.role !== 'operator' ? 'Promote to operator' : 'Demote operator'}
                          </MenuItem>
                          {
                            // No muted members in broadcast channel
                            !channel.isBroadcast && (
                              <MenuItem
                                onClick={() => {
                                  if (member.isMuted) {
                                    channel.unmuteUser(member, () => {
                                      setMembers(members.map(m => {
                                        if(m.userId === member.userId) {
                                          return {
                                            ...member,
                                            isMuted: false,
                                          };
                                        }
                                        return m;
                                      }));
                                      closeDropdown();
                                    })
                                  } else {
                                    channel.muteUser(member, () => {
                                      setMembers(members.map(m => {
                                        if(m.userId === member.userId) {
                                          return {
                                            ...member,
                                            isMuted: true,
                                          };
                                        }
                                        return m;
                                      }));
                                      closeDropdown();
                                    });
                                  }
                                }}
                              >
                                { member.isMuted ? 'Unmute' : 'Mute' }
                              </MenuItem>
                            )
                          }
                          <MenuItem
                            onClick={() => {
                              channel.banUser(member, -1, '', () => {
                                setMembers(members.filter(({ userId }) => {
                                  return userId !== member.userId;
                                }));
                              });
                            }}
                          >
                            Ban
                          </MenuItem>
                        </MenuItems>
                      )}
                    />
                  )}
                </>
              )}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
