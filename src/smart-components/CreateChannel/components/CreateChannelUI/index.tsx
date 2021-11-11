import './create-channel-ui.scss';

import React from 'react';

import { useCreateChannelContext } from '../../context/CreateChannelProvider';
import InviteMembers from '../InviteMembers';

import SelectChannelType from '../SelectChannelType';

export interface CreateChannelUIProps {
  onCancel?(): void;
  renderStepOne?:(props: void) => React.ReactNode;
}

const CreateChannel: React.FC<CreateChannelUIProps> = (props: CreateChannelUIProps) => {
  const { onCancel, renderStepOne } = props;

  const createChannelProps = useCreateChannelContext();
  const {
    step,
    setStep,
  } = createChannelProps;

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
          <InviteMembers
            onCancel={() => {
              setStep(0);
              onCancel();
            }}
          />
        )
      }
    </>
  )
}

export default CreateChannel;
