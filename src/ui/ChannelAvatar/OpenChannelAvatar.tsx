import React, { useMemo, useContext } from 'react';
import type { OpenChannel } from '@sendbird/chat/openChannel';

import Avatar from '../Avatar/index';
import { LocalizationContext } from '../../lib/LocalizationContext';

import * as utils from './utils';

interface Props {
  channel: OpenChannel;
  theme: string;
  height?: number;
  width?: number;
}

function ChannelAvatar({
  channel,
  theme,
  height = 56,
  width = 56,
}: Props): JSX.Element{
  const { stringSet } = useContext(LocalizationContext);
  const memoizedAvatar = useMemo(() => {
    return (
      <Avatar
        className="sendbird-chat-header__avatar--open-channel"
        src={utils.getOpenChannelAvatar(channel)}
        width={`${width}px`}
        height={`${height}px`}
        alt={channel?.name || stringSet.OPEN_CHANNEL_SETTINGS__NO_TITLE}
      />
    );
  }, [channel?.coverUrl, theme]);
  return (
    <>{ memoizedAvatar }</>
  );
}

export default ChannelAvatar;
