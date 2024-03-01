import React from 'react';
import { ChannelSettingsUIProps } from './components/ChannelSettingsUI';
import { ChannelSettingsContextProps } from './context/ChannelSettingsProvider';
interface ChannelSettingsProps extends ChannelSettingsUIProps, ChannelSettingsContextProps {
}
declare const ChannelSettings: React.FC<ChannelSettingsProps>;
export default ChannelSettings;
