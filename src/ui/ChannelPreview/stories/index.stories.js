import React from 'react';
import ChannelPreview from '../index.jsx';
import channels from '../../ChannelListDummy/dummyData.mock';

import IconButton from '../../IconButton';
import IconMore from '../../../svgs/icon-more.svg';

export default { title: 'UI Components/ChannelPreview' };

export const active = () => (
  <ChannelPreview
    channel={channels.channels[0]}
    isActive
    ChannelAction={() => (
      <IconButton width="26px" height="26px">
        <IconMore />
      </IconButton>
    )}
  />
);
export const notActive = () => (
  <ChannelPreview
    channel={channels.channels[0]}
    ChannelAction={() => (
      <IconButton width="26px" height="26px">
        <IconMore />
      </IconButton>
    )}
  />
);
