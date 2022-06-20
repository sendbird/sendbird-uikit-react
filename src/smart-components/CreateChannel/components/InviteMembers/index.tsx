import React, { useState, useEffect, useContext } from 'react';
import type { ApplicationUserListQuery } from '@sendbird/chat';

import './invite-members.scss';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useCreateChannelContext } from '../../context/CreateChannelProvider';
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

export interface InviteMembersProps {
  onCancel?: () => void;
}

const InviteMembers: React.FC<InviteMembersProps> = ({ onCancel }: InviteMembersProps) => {
  const {
    onBeforeCreateChannel,
    onCreateChannel,
    createChannel,
    type,
  } = useCreateChannelContext();

  const globalStore = useSendbirdStateContext();
  const userId = globalStore?.config?.userId;
  const sdk = globalStore?.stores?.sdkStore?.sdk as SendbirdGroupChat;
  const idsToFilter = [userId];
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const { stringSet } = useContext(LocalizationContext);
  const [usersDataSource, setUsersDataSource] = useState<ApplicationUserListQuery>(null);
  const selectedCount = Object.keys(selectedUsers).length;
  const titleText = stringSet.MODAL__CREATE_CHANNEL__TITLE;
  const submitText = stringSet.BUTTON__CREATE;

  const userQueryCreator = createDefaultUserListQuery({ sdk });

  useEffect(() => {
    const applicationUserListQuery = userQueryCreator;
    setUsersDataSource(applicationUserListQuery);
    applicationUserListQuery.next().then((users_) => {
      setUsers(users_);
    });
  }, []);

  return (
    <Modal
      titleText={titleText}
      submitText={submitText}
      type={ButtonTypes.PRIMARY}
      onCancel={onCancel}
      onSubmit={() => {
        const selectedUserList = Object.keys(selectedUsers);
        if (selectedUserList.length > 0) {
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
        }
      }}
    >
      <div>
        <Label
          color={(selectedCount > 0) ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3}
          type={LabelTypography.CAPTION_1}
        >
          {`${selectedCount} ${stringSet.MODAL__INVITE_MEMBER__SELECTEC}`}
        </Label>
        <div
          className="sendbird-create-channel--scroll"
          onScroll={(e) => {
            const eventTarget = e.target as HTMLDivElement;
            const { hasNext } = usersDataSource;
            const fetchMore = (
              eventTarget.clientHeight + eventTarget.scrollTop === eventTarget.scrollHeight
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

export default InviteMembers;
