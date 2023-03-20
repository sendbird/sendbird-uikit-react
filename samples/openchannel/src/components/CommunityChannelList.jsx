import React, { useEffect, useState } from "react";
import uuidv4 from '../../../../src/utils/uuid';

import "./community-channel-list.scss";
import OpenChannelPreview from "./OpenChannelPreview";
import Profile from "./Profile";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";

export default function CommunityChannelList({
  currentChannelUrl,
  setCurrentChannel
}) {
  const store = useSendbirdStateContext();
  const sdk = store?.stores?.sdkStore?.sdk;
  const user = store?.stores?.userStore?.user;
  const [channels, setChannels] = useState([]);
  useEffect(() => {
    if (!sdk || !sdk.openChannel) {
      return;
    }
    const openChannelListQuery = sdk.openChannel.createOpenChannelListQuery();
    const channelHandlerId = uuidv4();
    // @ts-ignore: Unreachable code error
    openChannelListQuery.customTypes = ["SB_COMMUNITY_TYPE"];
    openChannelListQuery.next().then(function (openChannels, error) {
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
