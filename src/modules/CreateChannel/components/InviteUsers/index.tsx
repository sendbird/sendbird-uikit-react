import React, { useState, useEffect, useContext } from 'react';
import type { ApplicationUserListQuery, User } from '@sendbird/chat';

import './invite-users.scss';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useCreateChannelContext, UserListQuery } from '../../context/CreateChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import type { GroupChannelCreateParams, SendbirdGroupChat } from '@sendbird/chat/groupChannel';

import Modal from '../../../../ui/Modal';
import Label, {
  LabelColors,
  LabelTypography,
} from '../../../../ui/Label';
import { ButtonTypes } from '../../../../ui/Button';
import UserListItem from '../../../../ui/UserListItem';

import {
  filterUser,
  setChannelType,
  createDefaultUserListQuery,
} from './utils';

export interface InviteUsersProps {
  onCancel?: () => void;
  userListQuery?(): UserListQuery;
}

const appHeight = () => {
  try {
    const doc = document.documentElement;
    doc.style.setProperty('--sendbird-vh', (window.innerHeight * 0.01) + 'px');
  } catch {
    //
  }
};

const BUFFER = 50;

const InviteUsers: React.FC<InviteUsersProps> = ({
  onCancel,
  userListQuery,
}: InviteUsersProps) => {
  const {
    onBeforeCreateChannel,
    onCreateChannel,
    overrideInviteUser,
    createChannel,
    type,
    excludeSelf
  } = useCreateChannelContext();

  const globalStore = useSendbirdStateContext();
  const userId = globalStore?.config?.userId;
  const sdk = globalStore?.stores?.sdkStore?.sdk as SendbirdGroupChat;
  const idsToFilter = [userId];
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const { stringSet } = useContext(LocalizationContext);
  const [usersDataSource, setUsersDataSource] = useState<ApplicationUserListQuery | UserListQuery>(null);
  const selectedCount = Object.keys(selectedUsers).length;
  const titleText = stringSet.MODAL__CREATE_CHANNEL__TITLE;
  const submitText = stringSet.BUTTON__CREATE;

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

  // https://stackoverflow.com/a/70302463
  // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/#css-custom-properties-the-trick-to-correct-sizing
  // to fix navbar break in mobile
  useEffect(() => {
    appHeight();
    window.addEventListener('resize', appHeight);
    return () => {
      window.removeEventListener('resize', appHeight);
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
        if (typeof overrideInviteUser === 'function') {
          overrideInviteUser({
            users: selectedUserList,
            onClose: onCancel,
            channelType: type,
          });
          return;
        }

        if (onBeforeCreateChannel) {
          const params = onBeforeCreateChannel(selectedUserList);
          setChannelType(params, type);
          createChannel(params).then((channel) => {
            onCreateChannel(channel);
          });
        } else {
          const params: GroupChannelCreateParams = {};
          params.invitedUserIds = selectedUserList;
          params.isDistinct = false;
          if (userId) {
            params.operatorUserIds = [userId];
          }
          setChannelType(params, type);
          // do not have custom params
          createChannel(params).then((channel) => {
            onCreateChannel(channel);
          });
        }
        onCancel();
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
          onScroll={(e) => {
            const eventTarget = e.target as HTMLDivElement;
            const { hasNext } = usersDataSource;
            const fetchMore = (
              (eventTarget.clientHeight + eventTarget.scrollTop + BUFFER) > eventTarget.scrollHeight
            );

            if (hasNext && fetchMore) {
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
            users.map((user) => (!excludeSelf && !filterUser(idsToFilter)(user.userId)) && (
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
