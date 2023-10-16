import React, { useState } from 'react';

import SendBirdProvider from '../Sendbird';
import withSendBird from '../SendbirdSdkContext';
import sendbirdSelectors from '../selectors';
import ChannelList from '../../modules/ChannelList';
import type { User } from '@sendbird/chat';
import { SendBirdState } from '../types';
import { LoggerInterface } from '../Logger';

const appId = process.env.STORYBOOK_APP_ID;
const userId = '__test_user--selectors';

export default { title: 'selectors/channels' };

const Welcome = ({ currentUser }: { currentUser: User }) => (
  <div>{`Hello, ${currentUser || 'unknown user'}`}</div>
);

const WelcomeWithSendBird = withSendBird(Welcome, (state) => {
  const sdk = sendbirdSelectors.getSdk(state);
  return { currentUser: sdk.currentUser };
});

export const getSdkStory = () => (
  <SendBirdProvider appId={appId} userId={userId} nickname={userId}>
    <WelcomeWithSendBird />
  </SendBirdProvider>
);
type Props = {
  createChannel: ReturnType<typeof sendbirdSelectors.getCreateGroupChannel>;
  leaveChannel: ReturnType<typeof sendbirdSelectors.getLeaveGroupChannel>;
  sdk: ReturnType<typeof sendbirdSelectors.getSdk>;
  logger: LoggerInterface;
};
const CustomComponent = ({ createChannel, leaveChannel, logger }: Props) => {
  const [channelUrl, setChannelUrl] = useState('');
  return (
    <>
      <button
        onClick={() => {
          createChannel({
            isPublic: false,
            isEphemeral: false,
            isDistinct: false,
            invitedUserIds: ['sravan'],
            name: 'NAME',
          })
            .then((c) => {
              setChannelUrl(c.url);
            })
            .catch((c) => logger.warning(c));
        }}
      >
        createChannel
      </button>
      <button
        onClick={() => {
          leaveChannel(channelUrl)
            .then(() => {
              setChannelUrl('');
            })
            .catch((c) => logger.warning(c));
        }}
      >
        LeaveChannel
      </button>
      <br />
      {`Created channel is: ${channelUrl}`}
    </>
  );
};

const CustomComponentWithSendBird = withSendBird(
  CustomComponent,
  (state: SendBirdState) => {
    const createChannel = sendbirdSelectors.getCreateGroupChannel(state);
    const leaveChannel = sendbirdSelectors.getLeaveGroupChannel(state);
    const sdk = sendbirdSelectors.getSdk(state);
    return { createChannel, sdk, leaveChannel, logger: state.config.logger };
  },
);

export const createAndLeaveChannel = () => (
  <SendBirdProvider appId={appId} userId={userId} nickname={userId}>
    <>
      <CustomComponentWithSendBird />
      <div style={{ width: '320px', height: '500px' }}>
        <ChannelList />
      </div>
    </>
  </SendBirdProvider>
);
