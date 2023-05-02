import React from 'react';

import OpenChanneSettingslUI, { OpenChannelUIProps } from './components/OpenChannelSettingsUI';
import { OpenChannelSettingsContextProps, OpenChannelSettingsProvider } from './context/OpenChannelSettingsProvider';

export interface OpenChannelSettingsProps extends OpenChannelSettingsContextProps, OpenChannelUIProps {
}

const OpenChannelSetting: React.FC<OpenChannelSettingsProps> = (props: OpenChannelSettingsProps) => {
  return (
    <OpenChannelSettingsProvider
      channelUrl={props?.channelUrl}
      onCloseClick={props?.onCloseClick}
      onBeforeUpdateChannel={props?.onBeforeUpdateChannel}
      onChannelModified={props?.onChannelModified}
      onDeleteChannel={props?.onDeleteChannel}
      disableUserProfile={props?.disableUserProfile}
      renderUserProfile={props?.renderUserProfile}
    >
      <OpenChanneSettingslUI
        renderOperatorUI={props?.renderOperatorUI}
        renderParticipantList={props?.renderParticipantList}
      />
    </OpenChannelSettingsProvider>
  );
};

export default OpenChannelSetting;
