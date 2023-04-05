import React from 'react';

import CreateChannelUI, {
  CreateChannelUIProps,
} from './components/CreateChannelUI';
import {
  CreateChannelProvider,
  CreateChannelProviderProps,
} from './context/CreateChannelProvider';

export interface CreateChannelProps extends CreateChannelProviderProps, CreateChannelUIProps {
}

const CreateChannel: React.FC<CreateChannelProps> = (props: CreateChannelProps) => {
  const {
    onBeforeCreateChannel,
    userListQuery,
    onCreateChannel,
    overrideInviteUser,
    onCancel,
    renderStepOne,
    customNewButton
  } = props;
  return (
    <CreateChannelProvider
      onBeforeCreateChannel={onBeforeCreateChannel}
      userListQuery={userListQuery}
      onCreateChannel={onCreateChannel}
      overrideInviteUser={overrideInviteUser}
      customNewButton={customNewButton}

    >
      <CreateChannelUI
        renderStepOne={renderStepOne}
        onCancel={onCancel}
      />
    </CreateChannelProvider>
  );
}

export default CreateChannel;
