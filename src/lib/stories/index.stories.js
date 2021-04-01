import React, { useEffect, useState } from 'react';

import SendBirdProvider from '../Sendbird';
import withSendBird from '../SendbirdSdkContext';
import sendBirdSelectors from '../selectors';
import Conversation from '../../smart-components/Conversation';
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

const WelcomeWithSendBird = withSendBird(Welcome, (state) => {
  const sdk =  sendBirdSelectors.getSdk(state);
  const currentUser = sdk && sdk.getCurrentUserId && sdk.getCurrentUserId();
  return ({ currentUser });
});

export const getSdkStory = () => (
  <SendBirdProvider appId={appId} userId={userId} nickname={userId}>
    <WelcomeWithSendBird />
  </SendBirdProvider>
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

const CustomComponentWithSendBird = withSendBird(CustomComponent, (state) => {
  const createChannel =  sendBirdSelectors.getCreateChannel(state);
  const leaveChannel =  sendBirdSelectors.getLeaveChannel(state);
  const sdk = sendBirdSelectors.getSdk(state);
  return ({ createChannel, sdk, leaveChannel });
});

export const createAndLeaveChannel = () => (
  <SendBirdProvider appId={appId} userId={userId} nickname={userId}>
    <CustomComponentWithSendBird />
    <div style={{ width: '320px', height: '500px' }}>
      <ChannelList />
    </div>
  </SendBirdProvider>
);
