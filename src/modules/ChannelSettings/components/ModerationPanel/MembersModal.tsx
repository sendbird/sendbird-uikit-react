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
import ContextMenu, { MenuItem, MenuItems, MuteMenuItem, OperatorMenuItem } from '../../../../ui/ContextMenu';
import { noop } from '../../../../utils/utils';

import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { Member } from '@sendbird/chat/groupChannel';
import { Role } from '@sendbird/chat';

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
  }, []);
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
                ]);
              });
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
                            <OperatorMenuItem
                              channel={channel}
                              user={member}
                              disable={currentUser === member.userId}
                              onChange={(_, member, isOperator) => {
                                setMembers(members.map(m => {
                                  if (m.userId === member.userId) {
                                    return {
                                      ...member,
                                      role: isOperator ? Role.OPERATOR : Role.NONE,
                                    };
                                  }
                                  return m;
                                }));
                                closeDropdown();
                              }}
                              onError={() => {
                                // FIXME: handle error later
                                closeDropdown();
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
                            </OperatorMenuItem>
                            {
                              // No muted members in broadcast channel
                              !channel?.isBroadcast && (
                                <MuteMenuItem
                                  channel={channel}
                                  user={member}
                                  onChange={(_, member, isMuted) => {
                                    setMembers(members.map(m => {
                                      if (m.userId === member.userId) {
                                        return {
                                          ...member,
                                          isMuted,
                                        };
                                      }
                                      return m;
                                    }));
                                    closeDropdown();
                                  }}
                                  onError={() => {
                                    // FIXME: handle error later
                                    closeDropdown();
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
                                </MuteMenuItem>
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
