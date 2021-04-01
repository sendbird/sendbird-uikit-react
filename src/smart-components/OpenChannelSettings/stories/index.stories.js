import React from 'react';

import Sendbird from '../../../lib/Sendbird';

import ChannelSetting from '../index';
import ModalRoot from '../../../hooks/useModal/ModalRoot';
import { MenuRoot } from '../../../ui/ContextMenu';

import { getSdk } from '../../../lib/selectors';
import withSendBird from '../../../lib/SendbirdSdkContext';

export default { title: 'OpenChannelSetting' };

const appId = process.env.STORYBOOK_APP_ID;;
const userId = 'leo.sub';
// use your own channelURL
const channelUrl = 'sendbird_open_channel_63320_451a6727b4b711b8a3a9b346770fb294e858e6de';

export const OpenChannelSetting = () => (
  <Sendbird
    appId={appId}
    userId={userId}
  >
    <div style={{ height: '600px', textAlign: 'center' }}>
      <ChannelSetting channelUrl={channelUrl} />
    </div>
    <ModalRoot />
    <MenuRoot />
  </Sendbird>
);

const CustomChannelSettings = ({ sdk }) => {
  return (
    <ChannelSetting
      channelUrl={channelUrl}
      onBeforeUpdateChannel={(currentTitle, currentImg, data) => {
        const param = new sdk.OpenChannelParams();
        param.name = currentTitle + 'test';
        param.coverUrl = currentImg;
        param.data = data;
        return param;
      }}
    />
  );
}
const OpenChannelWithSendbird = withSendBird(CustomChannelSettings, (store) => {
  return {
    sdk: getSdk(store),
  }
});

export const OpenChannelOnBefore = () => (
  <Sendbird
    appId={appId}
    userId="jaesung"
  >
    <div style={{ height: '600px', textAlign: 'center' }}>
      <OpenChannelWithSendbird />
    </div>
    <ModalRoot />
    <MenuRoot />
  </Sendbird>
);
