import './add-channel.scss';

import React, { useState } from 'react';

import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';

import CreateChannel from '../../../CreateChannel';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

export const AddChannel: React.VoidFunctionComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const state = useSendbirdStateContext();
  const isOnline = state?.config?.isOnline;
  const disabled = !isOnline;

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
            onCreateChannel={() => {
              setShowModal(false);
            }}
          />
        )
      }
    </>
  );
}

export default AddChannel;
