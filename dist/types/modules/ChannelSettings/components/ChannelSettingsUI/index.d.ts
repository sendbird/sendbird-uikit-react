import './channel-settings-ui.scss';
import React from 'react';
export interface ChannelSettingsUIProps {
    renderChannelProfile?: () => React.ReactElement;
    renderModerationPanel?: () => React.ReactElement;
    renderLeaveChannel?: () => React.ReactElement;
    renderPlaceholderError?: () => React.ReactElement;
    renderPlaceholderLoading?: () => React.ReactElement;
}
declare const ChannelSettingsUI: React.FC<ChannelSettingsUIProps>;
export default ChannelSettingsUI;
