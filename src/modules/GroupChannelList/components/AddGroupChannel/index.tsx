import React, { useState } from 'react';
import AddGroupChannelView from './AddGroupChannelView';
import { useGroupChannelList } from '../../context/useGroupChannelList';

export const AddGroupChannel = () => {
  const [createChannelVisible, setCreateChannelVisible] = useState(false);
  const {
    state: {
      onChannelCreated,
      onBeforeCreateChannel,
      onCreateChannelClick,
    },
  } = useGroupChannelList();

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
