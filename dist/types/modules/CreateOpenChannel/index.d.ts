import React from 'react';
import { CreateOpenChannelUIProps } from './components/CreateOpenChannelUI';
import { CreateOpenChannelProviderProps } from './context/CreateOpenChannelProvider';
export interface CreateOpenChannelProps extends CreateOpenChannelProviderProps, CreateOpenChannelUIProps {
}
declare function CreateOpenChannel({ className, onCreateChannel, onBeforeCreateChannel, closeModal, renderHeader, renderProfileInput, }: CreateOpenChannelProps): React.ReactElement;
export default CreateOpenChannel;
