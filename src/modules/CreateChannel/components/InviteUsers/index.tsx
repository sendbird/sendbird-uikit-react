import React, { useState, useEffect, useContext } from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';

import './invite-users.scss';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useCreateChannelContext } from '../../context/CreateChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';

import { filterUser, setChannelType, createDefaultUserListQuery } from './utils';
import { noop } from '../../../../utils/utils';
import { UserListQuery } from '../../../../types';

export interface InviteUsersProps {
  onCancel?: () => void;
  userListQuery?(): UserListQuery;
}

const BUFFER = 50;

const InviteUsers: React.FC<InviteUsersProps> = ({ onCancel, userListQuery }: InviteUsersProps) => {
  const { onCreateChannelClick, onBeforeCreateChannel, onChannelCreated, createChannel, onCreateChannel, overrideInviteUser, type } =
    useCreateChannelContext();

  const globalStore = useSendbirdStateContext();
  const userId = globalStore?.config?.userId;
  const sdk = globalStore?.stores?.sdkStore?.sdk;
  const idsToFilter = [userId];
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const { stringSet } = useContext(LocalizationContext);
  const [usersDataSource, setUsersDataSource] = useState<UserListQuery | null>(null);
  const selectedCount = Object.keys(selectedUsers).length;
  const titleText = stringSet.MODAL__CREATE_CHANNEL__TITLE;
  const submitText = stringSet.BUTTON__CREATE;
  const { isMobile } = useMediaQueryContext();
  const [scrollableAreaHeight, setScrollableAreaHeight] = useState<number>(window.innerHeight);

  const userQueryCreator = userListQuery ? userListQuery() : createDefaultUserListQuery({ sdk });

  useEffect(() => {
    const applicationUserListQuery = userQueryCreator;
    setUsersDataSource(applicationUserListQuery);
    // @ts-ignore
    if (!applicationUserListQuery?.isLoading) {
      applicationUserListQuery.next().then((users_) => {
        setUsers(users_);
      });
    }
  }, []);

  // To fix navbar break in mobile we set dynamic height to the scrollable area
  useEffect(() => {
    const scrollableAreaHeight = () => {
      setScrollableAreaHeight(window.innerHeight);
    };
    window.addEventListener('resize', scrollableAreaHeight);
    return () => {
      window.removeEventListener('resize', scrollableAreaHeight);
    };
  }, []);

  return (
    <Modal isFullScreenOnMobile titleText={titleText} onCancel={onCancel} hideFooter>
      <div
        className="sendbird-create-channel--scroll"
        style={isMobile ? { height: `calc(${scrollableAreaHeight}px - 200px)` } : {}}
        onScroll={(e) => {
          if (!usersDataSource) return;
          const eventTarget = e.target as HTMLDivElement;
          const { hasNext, isLoading } = usersDataSource;
          const fetchMore = eventTarget.clientHeight + eventTarget.scrollTop + BUFFER > eventTarget.scrollHeight;

          if (hasNext && fetchMore && !isLoading) {
            usersDataSource.next().then((usersBatch) => {
              setUsers([...users, ...usersBatch]);
            });
          }
        }}
      >
        {users.map(
          (user) =>
            !filterUser(idsToFilter)(user.userId) && (
              <UserListItem
                key={user.userId}
                user={user}
                onSubmit={(item) => {
                  const selectedUserList = [item];
                  const _onChannelCreated = onChannelCreated ?? onCreateChannel;
                  const _onCreateChannelClick = onCreateChannelClick ?? overrideInviteUser;

                  if (typeof _onCreateChannelClick === 'function') {
                    _onCreateChannelClick({
                      users: selectedUserList,
                      onClose: onCancel ?? noop,
                      channelType: type,
                    });
                    return;
                  }

                  if (onBeforeCreateChannel) {
                    const params = onBeforeCreateChannel(selectedUserList);
                    setChannelType(params, type);
                    createChannel(params).then((channel) => _onChannelCreated?.(channel));
                  } else {
                    const params: GroupChannelCreateParams = {};
                    params.invitedUserIds = selectedUserList;
                    params.isDistinct = false;
                    if (userId) {
                      params.operatorUserIds = [userId];
                    }
                    setChannelType(params, type);
                    // do not have custom params
                    createChannel(params).then((channel) => _onChannelCreated?.(channel));
                  }
                  onCancel?.();
                }}
              />
            )
        )}
      </div>
    </Modal>
  );
};

export default InviteUsers;
