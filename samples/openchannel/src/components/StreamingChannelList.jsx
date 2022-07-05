import React, { useEffect, useState } from "react";

import withSendbird from '../../../../src/lib/SendbirdSdkContext';
import * as sendbirdSelectors from '../../../../src/lib/selectors';
import "./streaming-channel-list.scss";
import OpenChannelPreview from "./OpenChannelPreview";
import Profile from "./Profile";

function StreamingChannelList({
  sdk,
  user,
  currentChannelUrl,
  setCurrentChannel
}) {
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    if (!sdk || !sdk.OpenChannel) {
      return;
    }
    const openChannelListQuery = sdk.OpenChannel.createOpenChannelListQuery();
    // @ts-ignore: Unreachable code error
    openChannelListQuery.customTypes = ["SB_LIVE_TYPE"];
    openChannelListQuery.next(function (openChannels, error) {
      if (error) {
        return;
      }
      setChannels(openChannels);
      if (openChannels.length > 0) {
        setCurrentChannel(openChannels[0]);
      }
    });
  }, [sdk]);

  return (
    <div className="streaming-channel-list">
      <div className="streaming-channel-list__title">Live streaming</div>
      <div className="streaming-channel-list__list">
        {channels.length === 0 ? (
          "No Channels"
        ) : (
          <div className="streaming-channel-list__scroll-wrap">
            <div>
              {channels.map((c) => (
                <OpenChannelPreview
                  isStreaming
                  key={c.url}
                  channel={c}
                  selected={c.url === currentChannelUrl}
                  onClick={() => {
                    setCurrentChannel(c);
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <p className="streaming-channel-list__placeholder">
          Preset channels developed by UI Kit
        </p>
      </div>
      <div className="streaming-channel-list__footer">
        <Profile user={user} />
      </div>
    </div>
  );
}

export default withSendbird(StreamingChannelList, (store) => {
  console.warn(store);
  return {
    sdk: sendbirdSelectors.getSdk(store),
    user: store.stores.userStore.user
  };
});
