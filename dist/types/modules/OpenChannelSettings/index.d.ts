import React from 'react';
import { OpenChannelUIProps } from './components/OpenChannelSettingsUI';
import { OpenChannelSettingsContextProps } from './context/OpenChannelSettingsProvider';
export interface OpenChannelSettingsProps extends OpenChannelSettingsContextProps, OpenChannelUIProps {
}
declare const OpenChannelSetting: React.FC<OpenChannelSettingsProps>;
export default OpenChannelSetting;
