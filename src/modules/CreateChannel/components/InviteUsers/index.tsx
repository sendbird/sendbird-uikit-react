import React, { useContext, useEffect, useRef, useState } from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';

import './invite-users.scss';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import Modal from '../../../../ui/Modal';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import { ButtonTypes } from '../../../../ui/Button';
import UserListItem from '../../../../ui/UserListItem';

import { createDefaultUserListQuery, filterUser, setChannelType } from './utils';
import { noop } from '../../../../utils/utils';
import { UserListQuery } from '../../../../types';
import useCreateChannel from '../../context/useCreateChannel';

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
    state: {
      onCreateChannelClick,
      onBeforeCreateChannel,
      onChannelCreated,
      onCreateChannel,
      overrideInviteUser,
      type,
    },
    actions: {
      createChannel,
    },
  } = useCreateChannel();

  const { state: { config: { userId }, stores: { sdkStore: { sdk, initialized } } } } = useSendbird();
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

  // Read via ref so the effect dep array only tracks `initialized`, not the query reference.
  // Consumers often pass an inline arrow for userListQuery; including it in deps would cause
  // a re-fetch on every parent render. The latest query is always picked up at connect-time.
  const userListQueryRef = useRef(userListQuery);
  userListQueryRef.current = userListQuery;

  // Shared cancellation flag — ref so the scroll handler can also check it. Reset to false at
  // the start of each effect run so scroll pagination from a stale run cannot mutate state.
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!initialized) return;
    cancelledRef.current = false;
    const applicationUserListQuery = userListQueryRef.current
      ? userListQueryRef.current()
      : createDefaultUserListQuery({ sdk });
    if (!applicationUserListQuery) return () => { cancelledRef.current = true; };
    setUsers([]); // Reset before async fetch so stale list is not shown during re-fetch.
    setUsersDataSource(applicationUserListQuery);
    applicationUserListQuery.next().then((it) => {
      if (!cancelledRef.current) setUsers(it);
    }).catch(() => {
      // Fetch failed (network error, expired token, etc.) — users stays []
    });
    return () => { cancelledRef.current = true; };
  }, [initialized]);

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
      disabled={!initialized || (users.length > 1 && Object.keys(selectedUsers).length === 0)}
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
                if (!cancelledRef.current) setUsers((prev) => [...prev, ...usersBatch]);
              }).catch(() => {
                // Scroll pagination failed — keep existing list
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
