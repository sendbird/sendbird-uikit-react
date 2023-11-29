import React, { useState } from 'react';
import AddGroupChannelView from './AddGroupChannelView';
import { useGroupChannelListContext } from '../../context/GroupChannelListProvider';

export const AddGroupChannel = () => {
  const [createChannelVisible, setCreateChannelVisible] = useState(false);
  const {
    onCreateChannel,
    onBeforeCreateChannel,
  } = useGroupChannelListContext();

  return (
    <AddGroupChannelView
      createChannelVisible={createChannelVisible}
      onChangeCreateChannelVisible={setCreateChannelVisible}
      onBeforeCreateChannel={onBeforeCreateChannel}
      onCreateChannel={onCreateChannel}
    />
  );
};

export default AddGroupChannel;
