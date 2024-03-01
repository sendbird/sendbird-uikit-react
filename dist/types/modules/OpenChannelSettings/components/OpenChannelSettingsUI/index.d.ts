import './open-channel-ui.scss';
import React from 'react';
export interface OpenChannelUIProps {
    renderOperatorUI?: () => React.ReactElement;
    renderParticipantList?: () => React.ReactElement;
}
declare const OpenChannelUI: React.FC<OpenChannelUIProps>;
export default OpenChannelUI;
