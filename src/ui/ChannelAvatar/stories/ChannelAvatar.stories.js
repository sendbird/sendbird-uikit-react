import React from 'react';
import ChannelAvatar from '../index';

const description = `
  \`import ChannelAvatar from "@sendbird/uikit-react/ui/ChannelAvatar";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/ChannelAvatar',
  component: ChannelAvatar,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (args) => <ChannelAvatar {...args} />;

export const simpleDefault = () => <ChannelAvatar channel={{ name: "12e" }} />;

export const defaultBroadcast = () => <ChannelAvatar channel={{ isBroadcast: true }} />;
export const defaultBroadcastDark = () => (
  <ChannelAvatar channel={{ isBroadcast: true }} theme="dark" />
);
