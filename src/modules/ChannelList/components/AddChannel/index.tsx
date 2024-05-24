import React, { useState } from 'react';
import { useChannelListContext } from '../../context/ChannelListProvider';
import AddGroupChannelView from '../../../GroupChannelList/components/AddGroupChannel/AddGroupChannelView';

export const AddChannel = () => {
  const [showModal, setShowModal] = useState(false);
  const { overrideInviteUser, onBeforeCreateChannel, onChannelSelect } = useChannelListContext();

  return (
    <AddGroupChannelView
      createChannelVisible={showModal}
      onChangeCreateChannelVisible={setShowModal}
      onCreateChannelClick={overrideInviteUser}
      onBeforeCreateChannel={onBeforeCreateChannel}
      onChannelCreated={it => onChannelSelect?.(it)}
    />
  );
};

export default AddChannel;
