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
  return (
    <CreateChannelProvider {...props}>
      <CreateChannelUI {...props}/>
    </CreateChannelProvider>
  );
};

export default CreateChannel;
