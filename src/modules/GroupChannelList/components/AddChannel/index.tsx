import React, { useState } from 'react';
import AddChannelView from './AddChannelView';
import { useGroupChannelListContext } from '../../context/GroupChannelListProvider';

export const AddChannel = () => {
  const [createChannelVisible, setCreateChannelVisible] = useState(false);
  const { onBeforeCreateChannel } = useGroupChannelListContext();

  return (
    <AddChannelView
      createChannelVisible={createChannelVisible}
      onChangeCreateChannelVisible={setCreateChannelVisible}
      onBeforeCreateChannel={onBeforeCreateChannel}
    />
  );
};

export default AddChannel;
