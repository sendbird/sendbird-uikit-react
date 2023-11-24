import React from 'react';

import Sendbird from '../../../lib/Sendbird';
import { GroupChannelList as Component } from '../index';

const appId = process.env.STORYBOOK_APP_ID;
const userId = 'sendbird';

export default { title: 'GroupChannelList' };

export const GroupChannelList = () => (
  <Sendbird
    appId={appId}
    userId={userId}
  >
    <div style={{ height: '100vh' }}>
      <Component />
    </div>
  </Sendbird>
);
