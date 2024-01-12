import React, { useState } from 'react';
import { useChannelListContext } from '../../context/ChannelListProvider';
import AddGroupChannelView from '../../../GroupChannelList/components/AddGroupChannel/AddGroupChannelView';

export const AddChannel = () => {
  const [showModal, setShowModal] = useState(false);
  const { overrideInviteUser, onBeforeCreateChannel } = useChannelListContext();

  return (
    <AddGroupChannelView
      createChannelVisible={showModal}
      onChangeCreateChannelVisible={setShowModal}
      onBeforeCreateChannel={onBeforeCreateChannel}
      onClickCreateChannel={overrideInviteUser}
    />
  );
};

export default AddChannel;
