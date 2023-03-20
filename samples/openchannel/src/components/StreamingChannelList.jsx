import "./streaming-channel-list.scss";

import React, { useEffect, useState } from "react";

import OpenChannelPreview from "./OpenChannelPreview";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";
import Profile from "./Profile";

export default function StreamingChannelList({
  currentChannelUrl,
  setCurrentChannel
}) {
  const [channels, setChannels] = useState([]);
  const store = useSendbirdStateContext();
  const sdk = store?.stores.sdkStore.sdk;
  const user = store?.stores.userStore.user;
  useEffect(() => {
    if (!sdk || !sdk.openChannel) {
      return;
    }
    const openChannelListQuery = sdk.openChannel.createOpenChannelListQuery();
    // @ts-ignore: Unreachable code error
    openChannelListQuery.customTypes = ["SB_LIVE_TYPE"];
    openChannelListQuery.next().then((openChannels) => {
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
