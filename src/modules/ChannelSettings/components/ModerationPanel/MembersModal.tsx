import React, {
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Role } from '@sendbird/chat';
import { type Member, MemberListQuery } from '@sendbird/chat/groupChannel';

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems, MuteMenuItem, OperatorMenuItem } from '../../../../ui/ContextMenu';
import { noop } from '../../../../utils/utils';

import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';

interface Props {
  onCancel(): void;
}

export default function MembersModal({ onCancel }: Props): ReactElement {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberQuery, setMemberQuery] = useState<MemberListQuery | null>(null);

  const channel = useChannelSettingsContext()?.channel;
  const state = useSendbirdStateContext();
  const currentUserId = state?.config?.userId;
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    const memberListQuery = channel?.createMemberListQuery({
      limit: 20,
    });
    memberListQuery?.next().then((members) => {
      setMembers(members);
    });
    setMemberQuery(memberListQuery ?? null);
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
          onScroll={useOnScrollPositionChangeDetector({
            onReachedBottom: async () => {
              const { hasNext } = memberQuery;
              if (hasNext) {
                memberQuery.next().then((o) => {
                  setMembers([
                    ...members,
                    ...o,
                  ]);
                });
              }
            },
          })}
        >
          {
            members.map((member: Member) => {
              return (
                <UserListItem
                  user={member}
                  key={member.userId}
                  currentUser={currentUserId}
                  action={({ parentRef, actionRef }) => (
                    <>
                      {channel?.myRole === 'operator' && currentUserId !== member.userId && (
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
                                disable={currentUserId === member.userId}
                                onChange={(_, member, isOperator) => {
                                  const newMembers = [ ...members ];
                                  for (const newMember of newMembers) {
                                    if (newMember.userId === member.userId) {
                                      newMember.role = isOperator ? Role.OPERATOR : Role.NONE;
                                    }
                                  }
                                  setMembers(newMembers);
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
                                      const newMembers = [ ...members ];
                                      for (const newMember of newMembers) {
                                        if (newMember.userId === member.userId) {
                                          newMember.isMuted = isMuted;
                                        }
                                      }
                                      setMembers(newMembers);
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
              );
            })
          }
        </div>
      </Modal>
    </div>
  );
}
