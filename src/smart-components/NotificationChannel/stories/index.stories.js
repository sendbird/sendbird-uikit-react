import React, { useState, useCallback } from 'react';

import Sendbird from '../../../lib/Sendbird';
const appId = '60E22A13-CC2E-4E83-98BE-578E72FC92F3';
const accessToken = '28e0b19b0ddd8cff01faf50e2b08797e77ea26a6';
const userId = 'sravan';

import NotificationChannel from '../index';

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
