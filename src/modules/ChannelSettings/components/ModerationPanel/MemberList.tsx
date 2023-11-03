import React, {ReactElement, useCallback, useContext, useEffect, useState,} from 'react';
import type {Member} from '@sendbird/chat/groupChannel';
import {MemberState} from '@sendbird/chat/groupChannel';

import Button, {ButtonSizes, ButtonTypes} from '../../../../ui/Button';
import IconButton from '../../../../ui/IconButton';
import Icon, {IconColors, IconTypes} from '../../../../ui/Icon';
import ContextMenu, {MenuItem, MenuItems} from '../../../../ui/ContextMenu';

import UserListItem from '../UserListItem';
import MembersModal from './MembersModal';
import InviteUsers from './InviteUsersModal';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import {useChannelSettingsContext} from '../../context/ChannelSettingsProvider';
import {LocalizationContext} from '../../../../lib/LocalizationContext';
import uuidv4 from '../../../../utils/uuid';
import {filterCurrentPageMembers, filterJoinedMembers, filterUptoCurrentPageMembers} from './utils';

const PAGE_SIZE = 5;

export const MemberList = (): ReactElement => {
  const [members, setMembers] = useState<Array<Member>>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasNext, setHasNext] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showInviteUsers, setShowInviteUsers] = useState(false);

  const state = useSendbirdStateContext();
  const {
    channel,
  } = useChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);

  const sdk = state?.stores?.sdkStore?.sdk;
  const userId = state?.config?.userId;

  function updateMembersWithCurrentPage(givenPage?: number) {
    const page = givenPage ?? currentPage;
    const filteredMembers: Member[] = filterCurrentPageMembers(
      filterJoinedMembers(channel.members),
      page,
      PAGE_SIZE
    );
    setMembers(filteredMembers);
    if (filteredMembers.length < PAGE_SIZE) {
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
  }, [channel]);

  const refreshList = useCallback(() => {
    if (!channel) {
      setMembers([]);
      return;
    }
    setCurrentPage(0);
    updateMembersWithCurrentPage(0);
  }, [channel.members]);

  return (
    <div className="sendbird-channel-settings-member-list sendbird-accordion">
      {
        members.map((member) => (
          <UserListItem
            key={member.userId}
            user={member}
            currentUser={sdk.currentUser.userId}
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
                        <MenuItem
                          onClick={() => {
                            if ((member.role !== 'operator')) {
                              channel?.addOperators([member.userId]).then(() => {
                                refreshList();
                                closeDropdown();
                              });
                            } else {
                              channel?.removeOperators([member.userId]).then(() => {
                                refreshList();
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
                                    refreshList();
                                    closeDropdown();
                                  });
                                } else {
                                  channel?.muteUser(member).then(() => {
                                    refreshList();
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
