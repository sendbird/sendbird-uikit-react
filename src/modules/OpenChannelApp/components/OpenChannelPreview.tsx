import React, { ReactElement, useMemo } from 'react';

import './open-channel-preview.scss';

import { ChannelMeta } from './DummyStream';
import { Freeze } from '../assets/Icons';
import Avatar from '../../../ui/Avatar';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { classnames } from '../../../utils/utils';

interface Props {
  channel: OpenChannel;
  selected: boolean;
  onClick(event): void;
  isStreaming?: boolean;
}

const kFormat = (num: number): string | number => {
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
  isStreaming = false,
}: Props): ReactElement {
  const streamInfo = useMemo(() => {
    let channelMeta: ChannelMeta | null = null;
    if (isStreaming) {
      try {
        channelMeta = JSON.parse(channel?.data);
      } catch (error) {
        channelMeta = null;
      }
    }
    return channelMeta;
  }, [isStreaming]);
  return (
    <div
      className={classnames('channel-preview', selected && 'channel-preview--selected', isStreaming && 'channel-preview--streaming')}
      onClick={onClick}
    >
      <div className="channel-preview__selection" />
      <div className="channel-preview__inner-left">
        <Avatar
          className="channel-preview__avatar"
          src={channel?.coverUrl}
          alt={channel?.name}
          width="32px"
          height="32px"
          customDefaultComponent={(style) => (
            <div style={{ ...style }}>
              <Icon
                type={IconTypes.CHANNELS}
                fillColor={IconColors.CONTENT}
                width="18px"
                height="18px"
              />
            </div>
          )}
        />
      </div>
      <div className="channel-preview__inner-right">
        <div className="channel-preview__name">
          {channel?.name}
          {
            channel?.isFrozen && (
              <Freeze />
            )
          }
        </div>
        {
          isStreaming && (
            <div className="channel-preview__creator-name">
              {streamInfo?.creator_info.name}
            </div>
          )
        }
        {
          isStreaming && (
            <div className="channel-preview__count">
              <div className="channel-preview__count-icon" />
              <div className="channel-preview__count-text">
                {kFormat(channel?.participantCount)}
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}
