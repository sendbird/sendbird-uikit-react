import React, { useState, useCallback } from 'react';

import Sendbird from '../../../lib/Sendbird';
const appId = '';
const accessToken = '';
const userId = 'sravan';

import NotificationChannel from '../index';

export default { title: 'NotficationChannel' };

export const NotificationChannel = () => (
  <Sendbird
    appId={appId}
    userId={userId}
    accessToken={accessToken}
  >
    <div style={{ height: '100vh' }}>
      <NotificationChannel />
    </div>
  </Sendbird>
);
