import React from 'react';
import { CreateChannelUIProps } from './components/CreateChannelUI';
import { CreateChannelProviderProps } from './context/CreateChannelProvider';
export interface CreateChannelProps extends CreateChannelProviderProps, CreateChannelUIProps {
}
declare const CreateChannel: React.FC<CreateChannelProps>;
export default CreateChannel;
