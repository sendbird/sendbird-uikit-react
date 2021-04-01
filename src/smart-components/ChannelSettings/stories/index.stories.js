import React from 'react';

import Sendbird from '../../../lib/Sendbird';

import ChannelSetting from '../index';
import ModalRoot from '../../../hooks/useModal/ModalRoot';
import { MenuRoot } from '../../../ui/ContextMenu';

import { getSdk } from '../../../lib/selectors';
import withSendBird from '../../../lib/SendbirdSdkContext';

export default { title: 'ChannelSetting' };

const appId = process.env.STORYBOOK_APP_ID;;
const userId = 'sendbird';
// use your own channelURL
const channelUrl = "sendbird_group_channel_199083408_359dd2e2afe107fa7d083bcd993a727f5e0bef9b";

export const IndependantChannelSetting = () => (
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

const ChannelWithOnBeforeUpdateChannel = ({ sdk }) => (
  <div style={{ height: '520px' }}>
    <ChannelSetting
      channelUrl={channelUrl}
      onBeforeUpdateChannel={(currentTitle, currentImg, channelData) => {
        if (!sdk || !sdk.GroupChannelParams) { return }
        const params = new sdk.GroupChannelParams();
        params.name = "custom name";
        return params;
      }}
    />
  </div>
)

const ConnectedChannelSettings = withSendBird(ChannelWithOnBeforeUpdateChannel, (store) => ({
  sdk: getSdk(store),
}))

export const OnBeforeUpdateChannel = () => (
  <Sendbird
    appId={appId}
    userId={userId}
  >
    <ConnectedChannelSettings />
  </Sendbird>
);

export const QueryParamsForChannel = () => (
  <Sendbird
    appId={appId}
    userId={userId}
  >
    <div style={{ height: '520px' }}>
      <ChannelSetting
        channelUrl={channelUrl}
        queries={{
          applicationUserListQuery: {
            limit: 30,
            userIdsFilter: ['hoon500'],
          },
        }}
      />
    </div>
  </Sendbird>
);

const CustomChannelProfile = ({ channel }) => {
  return (
    <div>
      This channel has {channel.memberCount} members
    </div>
  );
}

export const RenderChannelProfile = () => (
  <Sendbird
    appId={appId}
    userId={userId}
  >
    <div style={{ height: '520px' }}>
      <ChannelSetting
        channelUrl={channelUrl}
        renderChannelProfile={CustomChannelProfile}
      />
    </div>
  </Sendbird>
);
