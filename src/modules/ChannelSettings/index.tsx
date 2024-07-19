import React from 'react';
import ChannelSettingsUI, {
  ChannelSettingsUIProps,
} from './components/ChannelSettingsUI';

import {
  ChannelSettingsProvider,
  ChannelSettingsContextProps,
} from './context/ChannelSettingsProvider';

interface ChannelSettingsProps extends Omit<ChannelSettingsUIProps, 'renderUserListItem'>, ChannelSettingsContextProps { }

const ChannelSettings: React.FC<ChannelSettingsProps> = (props: ChannelSettingsProps) => {
  return (
    <ChannelSettingsProvider {...props}>
      <ChannelSettingsUI {...props} />
    </ChannelSettingsProvider>
  );
};

export default ChannelSettings;
