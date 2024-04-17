import './create-channel-ui.scss';

import React from 'react';

import { UserListQuery, useCreateChannelContext } from '../../context/CreateChannelProvider';
import InviteUsers from '../InviteUsers';

export interface CreateChannelUIProps {
  onCancel?(): void;
  renderStepOne?:(props: void) => React.ReactElement;
  userQuery?(): UserListQuery
}

const CreateChannel: React.FC<CreateChannelUIProps> = (props: CreateChannelUIProps) => {
  const { onCancel, userQuery } = props;

  const {
    userListQuery,
  } = useCreateChannelContext();

  return (
    <>
          <InviteUsers
            userListQuery={userQuery || userListQuery}
            onCancel={() => {
              onCancel();
            }}
          />
    </>
  );
};

export default CreateChannel;
