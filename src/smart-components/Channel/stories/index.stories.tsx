import React, { useCallback, useState } from 'react';

import Sendbird from '../../../lib/Sendbird';
const appId = process.env.STORYBOOK_APP_ID;
const userId = 'sendbird';

import Channel from '../../Channel';

export default { title: 'Channel' };

export const ChannelWithFilter = (): React.ReactElement => {
  const [channel, setChannel] = useState(null);
  const channelInput = React.createRef<HTMLInputElement>();
  const channelFilter = useCallback((message) => {
    const now = Date.now();
    const twoWeeksAgo = now - 1000 * 60 * 60 * 24 * 14;
    return message.createdAt > twoWeeksAgo;
  }, []);
  return (
    <Sendbird
      appId={appId}
      userId={userId}
    >
      <div style={{ height: '90vh' }}>
        <input type="text" ref={channelInput} />
        <button
          onClick={() => {
            setChannel(channelInput?.current?.value);
          }}
        >
          set channel url
        </button>
        <Channel
          channelUrl={channel}
          filterMessageList={channelFilter}
        />
      </div>
    </Sendbird>
  );
};
