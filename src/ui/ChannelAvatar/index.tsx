import React, { useMemo } from 'react';
import './index.scss';

import Avatar from '../Avatar/index';
import Icon, { IconTypes, IconColors } from '../Icon';

import * as utils from './utils';

interface Props {
  channel: SendBird.GroupChannel;
  userId: string;
  theme: string;
  width?: number,
  height?: number,
}

function ChannelAvatar({
  channel,
  userId,
  theme,
  width = 56,
  height = 56,
}: Props): JSX.Element{
  const isBroadcast = channel?.isBroadcast;
  const memoizedAvatar = useMemo(() => (
    isBroadcast
      ? (
        utils.useDefaultAvatar(channel)
          ? (
            <div
              className="sendbird-chat-header--default-avatar"
              style={{
                width,
                height,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon
                type={IconTypes.BROADCAST}
                fillColor={IconColors.CONTENT}
                width={width * 0.575}
                height={height * 0.575}
              />
            </div>
          )
          : (
            <Avatar
              className="sendbird-chat-header--avatar--broadcast-channel"
              src={utils.getChannelAvatarSource(channel, userId)}
              width={width}
              height={height}
              alt={channel.name}
            />
          )
      )
      : (
        <Avatar
          className="sendbird-chat-header--avatar--group-channel"
          src={utils.getChannelAvatarSource(channel, userId)}
          width={`${width}px`}
          height={`${height}px`}
          alt={channel.name}
        />
      )
  ),[channel?.members, channel?.coverUrl, theme]);
  return (
    <>{ memoizedAvatar }</>
  );
}

export default ChannelAvatar;
