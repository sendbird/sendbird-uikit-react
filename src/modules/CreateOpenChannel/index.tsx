import React from 'react';

import CreateOpenChannelUI, { CreateOpenChannelUIProps } from './components/CreateOpenChannelUI';
import { CreateOpenChannelProvider, CreateOpenChannelProviderProps } from './context/CreateOpenChannelProvider';

export interface CreateOpenChannelProps extends CreateOpenChannelProviderProps, CreateOpenChannelUIProps { }

function CreateOpenChannel({
  className,
  onCreateChannel,
  onBeforeCreateChannel,
  closeModal,
  renderHeader,
  renderProfileInput,
}: CreateOpenChannelProps): React.ReactElement {
  return (
    <CreateOpenChannelProvider
      className={className}
      onCreateChannel={onCreateChannel}
      onBeforeCreateChannel={onBeforeCreateChannel}
    >
      <CreateOpenChannelUI
        closeModal={closeModal}
        renderHeader={renderHeader}
        renderProfileInput={renderProfileInput}
      />
    </CreateOpenChannelProvider>
  );
}

export default CreateOpenChannel;
