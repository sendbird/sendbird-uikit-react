import React from 'react';
import OpenChannelAvatar from '../OpenChannelAvatar';

const description = `
  \`import OpenChannelAvatar from "@sendbird/uikit-react/ui/OpenChannelAvatar";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/OpenChannelAvatar',
  component: OpenChannelAvatar,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (args) => <OpenChannelAvatar {...args} />;

