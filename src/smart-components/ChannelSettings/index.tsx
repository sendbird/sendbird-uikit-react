import React from 'react';
import ChannelSettingsUI, {
  ChannelSettingsUIProps,
} from './components/ChannelSettingsUI';

import {
  ChannelSettingsProvider,
  ChannelSettingsContextProps,
} from './context/ChannelSettingsProvider';

interface ApplicationUserListQuery {
  limit?: number;
  userIdsFilter?: Array<string>;
  metaDataKeyFilter?: string;
  metaDataValuesFilter?: Array<string>;
}

interface ChannelSettingsProps extends ChannelSettingsUIProps, ChannelSettingsContextProps {
}

const ChannelSettings: React.FC<ChannelSettingsProps> = (props: ChannelSettingsProps) => {
  return (
    <ChannelSettingsProvider
      channelUrl={props.channelUrl}
      onCloseClick={props?.onCloseClick}
      onChannelModified={props?.onChannelModified}
      onBeforeUpdateChannel={props?.onBeforeUpdateChannel}
      queries={props?.queries}
      className={props?.className}
      disableUserProfile={props?.disableUserProfile}
      renderUserProfile={props?.renderChannelProfile}
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
