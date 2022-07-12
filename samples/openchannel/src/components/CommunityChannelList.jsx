import React, { useEffect, useState } from "react";
import withSendbird from "../../../lib/SendbirdSdkContext";
import * as sendbirdSelectors from "../../../lib/selectors";
import uuidv4 from '../../../../src/utils/uuid';

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
    const channelHandlerId = uuidv4();
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
    const channelHandlerParams = {
      onUserBanned: (channel, bannedUser) => {
        if (channel?.url === currentChannelUrl && user?.userId === bannedUser?.userId) {
          setChannels(channels.filter((ch) => ch?.url !== channel.url));
        }
      },
      onChannelDeleted: (channelUrl, channelType) => {
        if (channelType === 'open') {
          setChannels(channels.filter((channel) => channel?.url !== channelUrl));
        }
      }
    };
    sdk.OpenChannel.addOpenChannelHandler(channelHandlerId, channelHandlerParams);
    return () => {
      sdk.OpenChannel.removeOpenChannelHandler(channelHandlerId);
    }
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

export default withSendbird(CommunityChannelList, (store) => {
  return {
    sdk: sendbirdSelectors.getSdk(store),
    user: store.stores.userStore.user
  };
});
