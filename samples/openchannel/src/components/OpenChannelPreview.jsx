import React, { useMemo } from "react";

import "./open-channel-preview.scss";

// import { ChannelMeta } from "./DummyStream";

const kFormat = (num) => {
  if (num < 1000) {
    return num;
  }
  const trimmed = num / 1000;
  return `${trimmed.toFixed(2)} k`;
};

export default function OpenChannelPreview({
  channel,
  selected = false,
  onClick,
  isStreaming = false
}) {
  const streamInfo = useMemo(() => {
    let channelMeta;// ChannelMeta;
    if (isStreaming) {
      try {
        channelMeta = JSON.parse(channel.data);
      } catch (error) {
        channelMeta = null;
      }
    }
    return channelMeta;
  }, [isStreaming]);
  return (
    <div
      className={`
        channel-preview
        ${selected ? "channel-preview--selected" : null}
        ${isStreaming ? "channel-preview--streaming" : null}
      `}
      onClick={onClick}
    >
      <div className="channel-preview__selection" />
      <div className="channel-preview__inner-left">
        <div className="channel-preview__avatar">
          <img src={channel.coverUrl} alt={channel.name} />
        </div>
      </div>
      <div className="channel-preview__inner-right">
        <div className="channel-preview__name">{channel.name}</div>
        {isStreaming && (
          <div className="channel-preview__creator-name">
            {streamInfo.creator_info.name}
          </div>
        )}
        {isStreaming && (
          <div className="channel-preview__count">
            <div className="channel-preview__count-icon" />
            <div className="channel-preview__count-text">
              {kFormat(channel.participantCount)}
            </div>
          </div>
        )}
        {channel.isFrozen && <div style={{ position: "absolute" }}>*</div>}
      </div>
    </div>
  );
}
