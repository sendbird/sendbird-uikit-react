import React from 'react';
import ChannelSettingsUI, {
  ChannelSettingsUIProps,
} from './components/ChannelSettingsUI';

import {
  ChannelSettingsProvider,
  ChannelSettingsContextProps,
} from './context/ChannelSettingsProvider';

interface ChannelSettingsProps extends ChannelSettingsUIProps, ChannelSettingsContextProps {
}

const ChannelSettings: React.FC<ChannelSettingsProps> = (props: ChannelSettingsProps) => {
  return (
    <ChannelSettingsProvider
      overrideInviteUser={props?.overrideInviteUser}
      channelUrl={props.channelUrl}
      onCloseClick={props?.onCloseClick}
      onLeaveChannel={props?.onLeaveChannel}
      onChannelModified={props?.onChannelModified}
      onBeforeUpdateChannel={props?.onBeforeUpdateChannel}
      queries={props?.queries}
      className={props?.className}
      disableUserProfile={props?.disableUserProfile}
      renderUserProfile={props?.renderUserProfile}
    >
      <ChannelSettingsUI
        renderPlaceholderError={props?.renderPlaceholderError}
        renderChannelProfile={props?.renderChannelProfile}
        renderModerationPanel={props?.renderModerationPanel}
        renderLeaveChannel={props?.renderLeaveChannel}
      />
    </ChannelSettingsProvider>
  );
}

export default ChannelSettings;
