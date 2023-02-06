import React from 'react';

import Sendbird from '../../../lib/Sendbird';
import NotificationChannel from '../index';
import { TestApp } from './TestApp';

export default { title: 'NotficationChannel' };

const appId = '';
const userId = '';
const accessToken = '';

export const NotificationChannelComponent = () => (
  <Sendbird
    appId={appId}
    userId={userId}
    accessToken={accessToken}
  >
    <div style={{ height: '500px', width: '360px' }}>
      <NotificationChannel
        channelUrl={`SENDBIRD_NOTIFICATION_CHANNEL_NOTIFICATION_${userId}`}
      />
    </div>
  </Sendbird>
);

export const NotificationApp = () => {
  return (
    <TestApp />
  );
}
