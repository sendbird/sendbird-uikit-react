import React, { ReactElement, useEffect, useState } from 'react';

import withSendbird from '../../../lib/SendbirdSdkContext';
import * as sendbirdSelectors from '../../../lib/selectors';

import './streaming-channel-list.scss';
import OpenChannelPreview from './OpenChannelPreview';
import Profile from './Profile';
import { OpenChannel, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import { User } from '@sendbird/chat';

interface Props {
  sdk: SendbirdOpenChat;
  user: User;
  currentChannelUrl: string;
  setCurrentChannel(channel: OpenChannel): void;
}

function StreamingChannelList({
  sdk,
  user,
  currentChannelUrl,
  setCurrentChannel,
}: Props): ReactElement {
  const [channels, setChannels] = useState<Array<OpenChannel>>([]);
  useEffect(() => {
    if (!sdk || !sdk.openChannel) {
      return;
    }
    const openChannelListQuery = sdk.openChannel.createOpenChannelListQuery();
    // @ts-ignore: Unreachable code error
    openChannelListQuery.customTypes = ['SB_LIVE_TYPE'];
    openChannelListQuery.next().then((openChannels) => {
      setChannels(openChannels);
      if (openChannels.length > 0) {
        setCurrentChannel(openChannels[0]);
      }
    });
  }, [sdk]);

  return (
    <div className="streaming-channel-list">
      <div className="streaming-channel-list__title">
        Live streaming
      </div>
      <div className="streaming-channel-list__list">
        {
          channels.length === 0
          ? (
            "No Channels"
          )
          : (
            <div className="streaming-channel-list__scroll-wrap">
              <div>
                {
                  channels.map(c => (
                    <OpenChannelPreview
                      isStreaming
                      key={c.url}
                      channel={c}
                      selected={c.url === currentChannelUrl}
                      onClick={
                        () => {setCurrentChannel(c)}
                      }
                    />
                  ))
                }
              </div>
            </div>
          )
        }
        <p className="streaming-channel-list__placeholder">
          Preset channels developed by UI Kit
        </p>
      </div>
      <div className="streaming-channel-list__footer">
        <Profile user={user} />
      </div>
    </div>
  )
}

export default withSendbird(StreamingChannelList, (store) => {
  return {
    sdk: sendbirdSelectors.getSdk(store),
    user: store.stores.userStore.user,
  };
});
