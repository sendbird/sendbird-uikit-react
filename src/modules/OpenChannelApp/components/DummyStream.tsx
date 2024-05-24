import React, {
  ReactElement,
  useMemo,
} from 'react';

import './dummy-stream.scss';
import { LiveBadge } from '../assets/Icons';
import { OpenChannel } from '@sendbird/chat/openChannel';

export interface ChannelMeta {
  name: string;
  creator_info: CreatorInfo;
  tags?: Array<string> | null;
  thumbnail_url: string;
  live_channel_url: string;
}
export interface CreatorInfo {
  name: string;
  id: string;
  profile_url: string;
}

interface Props {
  currentChannel: OpenChannel;
}

export default function DummyStream({
  currentChannel,
}: Props): ReactElement {
  const streamInfo = useMemo(() => {
    let channelMeta: ChannelMeta | null;
    try {
      channelMeta = JSON.parse(currentChannel.data);
    } catch (error) {
      channelMeta = null;
    }
    return channelMeta;
  }, [currentChannel]);

  if (!streamInfo) {
    return (
      <div className="dummy-stream-empty">No information</div>
    );
  }
  return (
    <div className="dummy-stream-empty">
      <div className="dummy-stream-banner">
        <img src={streamInfo['live_channel_url']} alt={streamInfo.name} />
      </div>
      <div className="dummy-stream-panel">
        <div className="dummy-stream-panel__left">
          <div className="channel-avatar-large">
            <img src={streamInfo.thumbnail_url} alt={streamInfo.name} />
          </div>
        </div>
        <div className="dummy-stream-panel__right">
          <div className="stream-name">
            <LiveBadge />
            <div className="channel-name">{currentChannel.name}</div>
          </div>
          <div className="stream-meta">
            {currentChannel.participantCount} watching now. Started streaming 1 hours ago
          </div>
          <div className="stream-creator">
            <div className="stream-creator-name">
              {streamInfo.creator_info && streamInfo.creator_info.name}
            </div>
            <div className="stream-creator-tags">
              {
                streamInfo.tags && streamInfo.tags.map((tag) => (
                  <div className="tag" key={tag}>{tag}</div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
