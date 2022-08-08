import React from 'react';
import ChannelPreview from '../index.jsx';
import channels from './dummyData.mock';

import IconButton from '../../IconButton';
import IconMore from '../../../svgs/icon-more.svg';

const description = `
  \`Recommend to use "@sendbird/uikit-react/ChannelList/components/ChannelPreview" instead of this.\`
  \`We are removing this ui component in the next minor version.\`
`;

export default {
  title: '@sendbird/uikit-react/ui/ChannelPreview',
  component: ChannelPreview,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => <ChannelPreview {...arg} />

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
