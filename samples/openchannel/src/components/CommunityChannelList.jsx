import React, { ReactElement, useEffect, useState } from "react";
import withSendBird from "../../../lib/SendbirdSdkContext";
import sendBirdSelectors from "../../../lib/selectors";

import "./community-channel-list.scss";
import OpenChannelPreview from "./OpenChannelPreview";
import Profile from "./Profile";

function CommunityChannelList({
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
    openChannelListQuery.customTypes = ["SB_COMMUNITY_TYPE"];
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
    <div className="community-channel-list">
      <div className="community-channel-list__title">Live streaming</div>
      <div className="community-channel-list__list">
        {channels.length === 0 ? (
          "No Channels"
        ) : (
          <div className="community-channel-list__scroll-wrap">
            <div>
              {channels.map((c) => (
                <OpenChannelPreview
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
        <p className="community-channel-list__placeholder">
          Preset channels developed by UI Kit
        </p>
      </div>
      <div className="community-channel-list__footer">
        <Profile user={user} />
      </div>
    </div>
  );
}

export default withSendBird(CommunityChannelList, (store) => {
  return {
    sdk: sendBirdSelectors.getSdk(store),
    user: store.stores.userStore.user
  };
});
