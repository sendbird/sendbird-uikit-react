import React, { useState } from 'react';
import { useChannelListContext } from '../../context/ChannelListProvider';
import AddGroupChannelView from '../../../GroupChannelList/components/AddGroupChannel/AddGroupChannelView';
import { UserListQuery } from '../../../../types';

export interface AddChannelProps {
  userQuery?(): UserListQuery
}

export const AddChannel = (props: AddChannelProps) => {
  const { userQuery } = props;
  const [showModal, setShowModal] = useState(false);
  const { overrideInviteUser, onBeforeCreateChannel, onChannelSelect } = useChannelListContext();

  return (
    <AddGroupChannelView
      createChannelVisible={showModal}
      onChangeCreateChannelVisible={setShowModal}
      onCreateChannelClick={overrideInviteUser}
      onBeforeCreateChannel={onBeforeCreateChannel}
      onChannelCreated={onChannelSelect}
      userQuery={userQuery}
    />
  );
};

export default AddChannel;
