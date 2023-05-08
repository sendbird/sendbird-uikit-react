import './create-channel-ui.scss';

import React from 'react';

import { useCreateChannelContext } from '../../context/CreateChannelProvider';
import InviteUsers from '../InviteUsers';

import SelectChannelType from '../SelectChannelType';

export interface CreateChannelUIProps {
  onCancel?(): void;
  renderStepOne?:(props: void) => React.ReactElement;
}

const CreateChannel: React.FC<CreateChannelUIProps> = (props: CreateChannelUIProps) => {
  const { onCancel, renderStepOne } = props;

  const {
    step,
    setStep,
    userListQuery,
  } = useCreateChannelContext();

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
              onCancel();
            }}
          />
        )
      }
    </>
  );
};

export default CreateChannel;
