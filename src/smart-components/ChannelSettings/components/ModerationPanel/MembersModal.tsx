import React, {
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react'

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';
import { noop } from '../../../../utils/utils';

import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

interface Props {
  onCancel(): void;
}

export default function MembersModal({ onCancel }: Props): ReactElement {
  const [members, setMembers] = useState([]);
  const [memberQuery, setMemberQuery] = useState(null);

  const { channel } = useChannelSettingsContext();
  const state = useSendbirdStateContext();
  const currentUser = state?.config?.userId;
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    const memberListQuery = channel?.createMemberListQuery({
      limit: 20,
    });
    memberListQuery.next().then((members) => {
      setMembers(members);
    });
    setMemberQuery(memberListQuery);
  }, [])
  return (
    <div>
      <Modal
        hideFooter
        onCancel={() => onCancel()}
        onSubmit={noop}
        titleText={stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS}
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
              memberQuery.next().then((o) => {
                setMembers([
                  ...members,
                  ...o,
                ])
              });
            }
          }}
        >
          {
            members.map((member) => (
              <UserListItem
                user={member}
                key={member.userId}
                currentUser={currentUser}
                action={({ parentRef, actionRef }) => (
                  <>
                    {channel?.myRole === 'operator' && (
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
                                  channel?.addOperators([member.userId]).then(() => {
                                    setMembers(members.map(m => {
                                      if (m.userId === member.userId) {
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
                                  channel?.removeOperators([member.userId]).then(() => {
                                    setMembers(members.map(m => {
                                      if (m.userId === member.userId) {
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
                              {
                                member.role !== 'operator'
                                  ? stringSet.CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR
                                  : stringSet.CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR
                              }
                            </MenuItem>
                            {
                              // No muted members in broadcast channel
                              !channel?.isBroadcast && (
                                <MenuItem
                                  onClick={() => {
                                    if (member.isMuted) {
                                      channel?.unmuteUser(member).then(() => {
                                        setMembers(members.map(m => {
                                          if (m.userId === member.userId) {
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
                                      channel?.muteUser(member).then(() => {
                                        setMembers(members.map(m => {
                                          if (m.userId === member.userId) {
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
                                  {
                                    member.isMuted
                                      ? stringSet.CHANNEL_SETTING__MODERATION__UNMUTE
                                      : stringSet.CHANNEL_SETTING__MODERATION__MUTE
                                  }
                                </MenuItem>
                              )
                            }
                            <MenuItem
                              onClick={() => {
                                channel?.banUser(member, -1, '').then(() => {
                                  setMembers(members.filter(({ userId }) => {
                                    return userId !== member.userId;
                                  }));
                                });
                              }}
                            >
                              {stringSet.CHANNEL_SETTING__MODERATION__BAN}
                            </MenuItem>
                          </MenuItems>
                        )}
                      />
                    )}
                  </>
                )}
              />
            ))
          }
        </div>
      </Modal>
    </div>
  );
}
