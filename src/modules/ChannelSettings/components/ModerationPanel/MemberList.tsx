import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import type { Member } from '@sendbird/chat/groupChannel';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems, MuteMenuItem, OperatorMenuItem } from '../../../../ui/ContextMenu';

import UserListItem from '../UserListItem';
import MembersModal from './MembersModal';
import InviteUsers from './InviteUsersModal';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { noop } from '../../../../utils/utils';
import uuidv4 from '../../../../utils/uuid';

export const MemberList = (): ReactElement => {
  const [members, setMembers] = useState<Array<Member>>([]);
  const [hasNext, setHasNext] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showInviteUsers, setShowInviteUsers] = useState(false);

  const state = useSendbirdStateContext();
  const {
    channel,
    setChannelUpdateId,
  } = useChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);

  const sdk = state?.stores?.sdkStore?.sdk;
  const userId = state?.config?.userId;

  useEffect(() => {
    if (!channel) {
      setMembers([]);
      return;
    }

    const memberUserListQuery = channel?.createMemberListQuery({ limit: 10 });
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
    const memberUserListQuery = channel?.createMemberListQuery({ limit: 10 });
    memberUserListQuery.next().then((members) => {
      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
      setChannelUpdateId?.(uuidv4());
    });
  }, [channel]);

  return (
    <div className="sendbird-channel-settings-member-list">
      {
        members.map((member) => (
          <UserListItem
            key={member.userId}
            user={member}
            currentUser={sdk?.currentUser?.userId}
            action={
              (channel?.myRole === 'operator' && userId !== member.userId)
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
                        <OperatorMenuItem
                          channel={channel}
                          user={member}
                          onChange={() => {
                            refreshList();
                            closeDropdown();
                          }}
                          onError={noop} // TODO: We will handle error
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
                              onChange={() => {
                                refreshList();
                                closeDropdown();
                              }}
                              onError={noop} // TODO: We will handle error
                              dataSbId={`channel_setting_member_context_menu_${member.isMuted ? 'unmute' : 'mute'}`}
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
                              refreshList();
                              closeDropdown();
                            });
                          }}
                          dataSbId="channel_setting_member_context_menu_ban"
                        >
                          {stringSet.CHANNEL_SETTING__MODERATION__BAN}
                        </MenuItem>
                      </MenuItems>
                    )}
                  />
                )
                : () => null
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
              {stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS}
            </Button>
          )
        }
        <Button
          type={ButtonTypes.SECONDARY}
          size={ButtonSizes.SMALL}
          onClick={() => setShowInviteUsers(true)}
        >
          {stringSet.CHANNEL_SETTING__MEMBERS__INVITE_MEMBER}
        </Button>
      </div>
      {
        showAllMembers && (
          <MembersModal
            onCancel={() => {
              setShowAllMembers(false);
              refreshList();
            }}
          />
        )
      }
      {
        showInviteUsers && (
          <InviteUsers
            onSubmit={() => {
              setShowInviteUsers(false);
              refreshList();
            }}
            onCancel={() => setShowInviteUsers(false)}
          />
        )
      }
    </div>
  );
};

export default MemberList;
