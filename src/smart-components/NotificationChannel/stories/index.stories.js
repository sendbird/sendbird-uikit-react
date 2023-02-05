import React, { useState, useCallback } from 'react';

import Sendbird from '../../../lib/Sendbird';
import NotificationChannel from '../index';
import { TestApp } from './TestApp';

export default { title: 'NotficationChannel' };

export const NotificationChannelComponenet = () => (
  <Sendbird
    appId={appId}
    userId={userId}
    accessToken={accessToken}
  >
    <div style={{ height: '500px', width: '360px' }}>
      <NotificationChannel
        channelUrl='SENDBIRD_NOTIFICATION_CHANNEL_NOTIFICATION_sravan'
      />
    </div>
  </Sendbird>
);

export const NotificationApp = () => {
  return (
    <TestApp />
  );
}
