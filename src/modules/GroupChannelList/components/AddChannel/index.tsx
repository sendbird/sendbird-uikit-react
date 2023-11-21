import React, { useState } from 'react';

import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';

import CreateChannel from '../../../CreateChannel';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useGroupChannelListContext } from '../../context/GroupChannelListProvider';

export const AddChannel = () => {
  const [showModal, setShowModal] = useState(false);
  const state = useSendbirdStateContext();
  const isOnline = state?.config?.isOnline;
  const disabled = !isOnline;
  const {
    // overrideInviteUser,
    onBeforeCreateChannel,
  } = useGroupChannelListContext();

  return (
    <>
      <IconButton
        height="32px"
        width="32px"
        onClick={() => {
          setShowModal(true);
        }}
        disabled={disabled}
      >
        <Icon
          type={IconTypes.CREATE}
          fillColor={IconColors.PRIMARY}
          width="24px"
          height="24px"
        />
      </IconButton>
      {
        showModal && (
          <CreateChannel
            onCancel={() => {
              setShowModal(false);
            }}
            // overrideInviteUser={overrideInviteUser}
            onCreateChannel={() => {
              setShowModal(false);
            }}
            onBeforeCreateChannel={onBeforeCreateChannel}
          />
        )
      }
    </>
  );
};

export default AddChannel;
