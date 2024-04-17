import React, { useState } from 'react';
import AddGroupChannelView from './AddGroupChannelView';
import { useGroupChannelListContext } from '../../context/GroupChannelListProvider';
import { UserListQuery } from '../../../../types';

export interface AddGroupChannelProps {
  userQuery?(): UserListQuery
}

export const AddGroupChannel = (props: AddGroupChannelProps) => {
  const { userQuery } = props;
  const [createChannelVisible, setCreateChannelVisible] = useState(false);
  const { onChannelCreated, onBeforeCreateChannel, onCreateChannelClick } = useGroupChannelListContext();

  return (
    <AddGroupChannelView
      createChannelVisible={createChannelVisible}
      onChangeCreateChannelVisible={setCreateChannelVisible}
      onCreateChannelClick={onCreateChannelClick}
      onBeforeCreateChannel={onBeforeCreateChannel}
      onChannelCreated={onChannelCreated}
      userQuery={userQuery}
    />
  );
};

export default AddGroupChannel;
