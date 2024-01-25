import React, { useEffect, useMemo, useState } from 'react';
import { User } from '@sendbird/chat';

import Modal from '../../../../ui/Modal';
import { ButtonTypes } from '../../../../ui/Button';
import UserListItem from '../../../../ui/UserListItem';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';
import { UserListQuery } from '../../../../types';

type UserId = string;
interface Props {
  onCancel(): void;
  onSubmit(userIds: UserId[]): void;
}

export default function InviteUsers({ onCancel, onSubmit }: Props) {
  const [users, setUsers] = useState([]);
  const [userListQuery, setUserListQuery] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState<Record<UserId, User>>({});

  const state = useSendbirdStateContext();
  const sdk = state?.stores?.sdkStore?.sdk;
  const globalUserListQuery = state?.config?.userListQuery;

  const { channel, overrideInviteUser, queries, forceUpdateUI } = useChannelSettingsContext();
  const { stringSet } = useLocalization();

  const onScroll = useOnScrollPositionChangeDetector({
    async onReachedBottom() {
      if (userListQuery?.hasNext) {
        const users = await userListQuery.next();
        setUsers((prev) => [...prev, ...users]);
      }
    },
  });

  const onInviteUsers = async () => {
    const userIdsToInvite = Object.keys(selectedUsers);
    if (typeof overrideInviteUser === 'function') {
      overrideInviteUser({ users: userIdsToInvite, onClose: onCancel, channel });
    } else {
      await channel?.inviteWithUserIds(userIdsToInvite);
      onSubmit(userIdsToInvite);
    }
  };

  const onSelectUser = (user: User) => {
    setSelectedUsers(({ ...draft }) => {
      if (draft[user.userId]) {
        delete draft[user.userId];
      } else {
        draft[user.userId] = user;
      }
      return draft;
    });
  };

  const membersMap = useMemo(() => {
    // UIKit policy: In a super or broadcast channel, do not check the members when inviting users.
    if (channel?.isSuper || channel?.isBroadcast) return { [sdk.currentUser.userId]: sdk.currentUser };

    return channel?.members.reduce((acc, cur) => {
      acc[cur.userId] = cur;
      return acc;
    }, {} as Record<UserId, User>);
  }, [channel?.members.length]);

  useEffect(() => {
    const fetchUsersAndSetQuery = async () => {
      let query: UserListQuery = globalUserListQuery?.() ?? sdk?.createApplicationUserListQuery(queries?.applicationUserListQuery);
      if (query) {
        const users = await query.next();
        setUserListQuery(query);
        setUsers(users);
      }
    };

    fetchUsersAndSetQuery();
  }, [sdk]);

  return (
    <div>
      <Modal
        isFullScreenOnMobile
        disabled={Object.keys(selectedUsers).length === 0}
        submitText={stringSet.BUTTON__INVITE}
        type={ButtonTypes.PRIMARY}
        onCancel={() => onCancel()}
        onSubmit={onInviteUsers}
        titleText={stringSet.CHANNEL_SETTING__MEMBERS__SELECT_TITLE}
      >
        <div className="sendbird-more-members__popup-scroll" onScroll={onScroll}>
          <div className="sendbird-more-members__popup-scroll__inner">
            {users.map((user) => {
              const isMember = Boolean(membersMap[user.userId]);
              const isSelected = Boolean(selectedUsers[user.userId]);
              return (
                <UserListItem
                  key={user.userId}
                  checkBox
                  checked={isMember || isSelected}
                  disabled={isMember}
                  user={user}
                  onChange={() => onSelectUser(user)}
                />
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
