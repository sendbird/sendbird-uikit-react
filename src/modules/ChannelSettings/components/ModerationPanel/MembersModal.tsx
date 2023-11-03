import React, {
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';
import { noop } from '../../../../utils/utils';

import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { Member } from '@sendbird/chat/groupChannel';
import {filterCurrentPageMembers, filterJoinedMembers, filterUptoCurrentPageMembers} from './utils';

interface Props {
  onCancel(): void;
}

const PAGE_SIZE = 10;

export default function MembersModal({ onCancel }: Props): ReactElement {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasNext, setHasNext] = useState(false);

  const { channel } = useChannelSettingsContext();
  const state = useSendbirdStateContext();
  const currentUser = state?.config?.userId;
  const { stringSet } = useContext(LocalizationContext);

  function updateMembersWithCurrentPage(givenPage?: number) {
    const page = givenPage ?? currentPage;
    const filteredMembers: Member[] = filterUptoCurrentPageMembers(
      filterJoinedMembers(channel.members),
      page,
      PAGE_SIZE
    );
    setMembers(filteredMembers);
    if (filteredMembers.length < PAGE_SIZE * page) {
      setHasNext(false);
    } else {
      setHasNext(true);
      setCurrentPage(page + 1);
    }
  }

  useEffect(() => {
    if (!channel) {
      setMembers([]);
      return;
    }
    setCurrentPage(0);
    updateMembersWithCurrentPage(0);
  }, [channel.members]);

  return (
    <div>
      <Modal
        isFullScreenOnMobile
        hideFooter
        onCancel={() => onCancel()}
        onSubmit={noop}
        titleText={stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS}
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={(e) => {
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              updateMembersWithCurrentPage();
            }
          }}
        >
          {
            members.map((member: Member) => (
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
                            onClick={() => {
                              toggleDropdown();
                            }}
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
                              disable={currentUser === member.userId}
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
                              dataSbId={`channel_setting_member_context_menu_${(
                                member.role !== 'operator'
                              ) ? 'register_as_operator' : 'unregister_operator'}`}
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
                                      });
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
                                  dataSbId={`channel_setting_member_context_menu_${(
                                    member.isMuted) ? 'unmute' : 'mute'}`
                                  }
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
                              dataSbId="channel_setting_member_context_menu_ban"
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
