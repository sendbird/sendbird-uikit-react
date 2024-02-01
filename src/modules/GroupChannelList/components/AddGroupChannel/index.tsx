import React, { useState } from 'react';
import AddGroupChannelView from './AddGroupChannelView';
import { useGroupChannelListContext } from '../../context/GroupChannelListProvider';

export const AddGroupChannel = () => {
  const [createChannelVisible, setCreateChannelVisible] = useState(false);
  const { onChannelCreated, onBeforeCreateChannel, onCreateChannelClick } = useGroupChannelListContext();

  return (
    <AddGroupChannelView
      createChannelVisible={createChannelVisible}
      onChangeCreateChannelVisible={setCreateChannelVisible}
      onCreateChannelClick={onCreateChannelClick}
      onBeforeCreateChannel={onBeforeCreateChannel}
      onChannelCreated={onChannelCreated}
    />
  );
};

export default AddGroupChannel;
