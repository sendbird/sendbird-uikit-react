import React, { useState } from 'react';

import SendbirdProvider from '../Sendbird';
import withSendbird from '../SendbirdSdkContext';
import sendbirdSelectors from '../selectors';
import ChannelList from '../../smart-components/ChannelList';

const appId = process.env.STORYBOOK_APP_ID;
const userId = '__test_user--selectors';
const channelId = '';

export default { title: 'selectors/channels' };

const Welcome = ({ currentUser }) => (
  <div>
    {`Hello, ${currentUser || 'unknown user'}`}
  </div>
);

const WelcomeWithSendbird = withSendbird(Welcome, (state) => {
  const sdk =  sendbirdSelectors.getSdk(state);
  const currentUser = sdk && sdk.getCurrentUserId && sdk.getCurrentUserId();
  return ({ currentUser });
});

export const getSdkStory = () => (
  <SendbirdProvider appId={appId} userId={userId} nickname={userId}>
    <WelcomeWithSendbird />
  </SendbirdProvider>
)

const CustomComponent = ({ createChannel, sdk, leaveChannel }) => {
  const [channelUrl, setChannelUrl] = useState('');
  return(
    <>
      <button onClick={() => {
        let params = new sdk.GroupChannelParams();
        params.isPublic = false;
        params.isEphemeral = false;
        params.isDistinct = false;
        params.addUserIds(['sravan']);
        params.name = "NAME";
        createChannel(params).then(c => {
          setChannelUrl(c.url);
        }).catch(c => console.warn(c));
      }}>
        createChannel
      </button>
      <button onClick={() => {
        leaveChannel(channelUrl).then(c => {
          setChannelUrl('');
        }).catch(c => console.warn(c));
      }}>
        LeaveChannel
      </button>
      <br />
      { `Created channel is: ${channelUrl}` }
    </>
  );
};

const CustomComponentWithSendbird = withSendbird(CustomComponent, (state) => {
  const createChannel =  sendbirdSelectors.getCreateChannel(state);
  const leaveChannel =  sendbirdSelectors.getLeaveChannel(state);
  const sdk = sendbirdSelectors.getSdk(state);
  return ({ createChannel, sdk, leaveChannel });
});

export const createAndLeaveChannel = () => (
  <SendbirdProvider appId={appId} userId={userId} nickname={userId}>
    <CustomComponentWithSendbird />
    <div style={{ width: '320px', height: '500px' }}>
      <ChannelList />
    </div>
  </SendbirdProvider>
);
