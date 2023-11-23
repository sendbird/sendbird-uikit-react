import React, { useState } from 'react';
import { useChannelListContext } from '../../context/ChannelListProvider';
import AddChannelView from '../../../GroupChannelList/components/AddChannel/AddChannelView';

export const AddChannel = () => {
  const [showModal, setShowModal] = useState(false);
  const { overrideInviteUser, onBeforeCreateChannel } = useChannelListContext();

  return (
    <AddChannelView
      createChannelVisible={showModal}
      onChangeCreateChannelVisible={setShowModal}
      onBeforeCreateChannel={onBeforeCreateChannel}
      overrideInviteUser={overrideInviteUser}
    />
  );
};

export default AddChannel;
