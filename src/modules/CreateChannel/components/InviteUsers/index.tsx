import React, { useContext, useEffect, useState } from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';

import './invite-users.scss';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useCreateChannelContext } from '../../context/CreateChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import Modal from '../../../../ui/Modal';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import { ButtonTypes } from '../../../../ui/Button';
import UserListItem from '../../../../ui/UserListItem';

import { createDefaultUserListQuery, filterUser, setChannelType } from './utils';
import { noop } from '../../../../utils/utils';
import { UserListQuery } from '../../../../types';

export interface InviteUsersProps {
  onCancel?: () => void;
  userListQuery?(): UserListQuery;
}

const BUFFER = 50;

const InviteUsers: React.FC<InviteUsersProps> = ({
  onCancel,
  userListQuery,
}: InviteUsersProps) => {
  const {
    onCreateChannelClick,
    onBeforeCreateChannel,
    onChannelCreated,
    createChannel,
    onCreateChannel,
    overrideInviteUser,
    type,
  } = useCreateChannelContext();

  const globalStore = useSendbirdStateContext();
  const userId = globalStore?.config?.userId;
  const sdk = globalStore?.stores?.sdkStore?.sdk;
  const idsToFilter = [userId];
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Record<string, boolean>>({});
  const { stringSet } = useContext(LocalizationContext);
  const [usersDataSource, setUsersDataSource] = useState<UserListQuery | null>(null);
  const selectedCount = Object.keys(selectedUsers).length;
  const titleText = stringSet.MODAL__CREATE_CHANNEL__TITLE;
  const submitText = stringSet.BUTTON__CREATE;
  const { isMobile } = useMediaQueryContext();
  const [scrollableAreaHeight, setScrollableAreaHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const applicationUserListQuery = userListQuery ? userListQuery() : createDefaultUserListQuery({ sdk });
    setUsersDataSource(applicationUserListQuery);
    if (!applicationUserListQuery?.isLoading) {
      applicationUserListQuery.next().then((it) => {
        setUsers(it);
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
    <Modal
      isFullScreenOnMobile
      titleText={titleText}
      submitText={submitText}
      type={ButtonTypes.PRIMARY}
      // Disable the create button if no users are selected,
      // but if there's only the logged-in user in the user list,
      // then the create button should be enabled
      disabled={users.length > 1 && Object.keys(selectedUsers).length === 0}
      onCancel={onCancel}
      onSubmit={() => {
        const selectedUserList = Object.keys(selectedUsers).length > 0
          ? Object.keys(selectedUsers)
          : [userId];
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
    >
      <div>
        <Label
          color={(selectedCount > 0) ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3}
          type={LabelTypography.CAPTION_1}
        >
          {`${selectedCount} ${stringSet.MODAL__INVITE_MEMBER__SELECTED}`}
        </Label>
        <div
          className="sendbird-create-channel--scroll"
          style={isMobile ? { height: `calc(${scrollableAreaHeight}px - 200px)` } : {}}
          onScroll={(e) => {
            if (!usersDataSource) return;
            const eventTarget = e.target as HTMLDivElement;
            const { hasNext, isLoading } = usersDataSource;
            const fetchMore = (
              (eventTarget.clientHeight + eventTarget.scrollTop + BUFFER) > eventTarget.scrollHeight
            );

            if (hasNext && fetchMore && !isLoading) {
              usersDataSource.next().then((usersBatch) => {
                setUsers([
                  ...users,
                  ...usersBatch,
                ]);
              });
            }
          }}
        >
          {
            users.map((user) => (!filterUser(idsToFilter)(user.userId)) && (
              <UserListItem
                key={user.userId}
                user={user}
                checkBox
                checked={selectedUsers[user.userId]}
                onChange={
                  (event) => {
                    const modifiedSelectedUsers = {
                      ...selectedUsers,
                      [event.target.id]: event.target.checked,
                    };
                    if (!event.target.checked) {
                      delete modifiedSelectedUsers[event.target.id];
                    }
                    setSelectedUsers(modifiedSelectedUsers);
                  }
                }
              />
            ))
          }
        </div>
      </div>
    </Modal>
  );
};

export default InviteUsers;
