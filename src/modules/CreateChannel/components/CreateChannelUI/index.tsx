import './create-channel-ui.scss';

import React from 'react';

import InviteUsers from '../InviteUsers';

import SelectChannelType from '../SelectChannelType';
import useCreateChannel from '../../context/useCreateChannel';

export interface CreateChannelUIProps {
  onCancel?(): void;
  renderStepOne?:(props: void) => React.ReactElement;
}

const CreateChannel: React.FC<CreateChannelUIProps> = (props: CreateChannelUIProps) => {
  const { onCancel, renderStepOne } = props;

  const {
    state: {
      step,
      userListQuery,
    },
    actions: {
      setStep,
    },
  } = useCreateChannel();

  return (
    <>
      {
        step === 0 && (
          renderStepOne?.() || (
            <SelectChannelType
              onCancel={onCancel}
            />
          )
        )
      }
      {
        step === 1 && (
          <InviteUsers
            userListQuery={userListQuery}
            onCancel={() => {
              setStep(0);
              onCancel?.();
            }}
          />
        )
      }
    </>
  );
};

export default CreateChannel;
