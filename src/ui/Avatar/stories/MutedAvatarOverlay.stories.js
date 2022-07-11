import React from 'react';

import MutedAvatarOverlay from '../MutedAvatarOverlay';

const description = `
  \`import MutedAvatarOverlay from "@sendbird/uikit-react/ui/MutedAvatarOverlay";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/MutedAvatarOverlay',
  component: MutedAvatarOverlay,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};


export const WithControls = (args) => (
  <MutedAvatarOverlay {...args} />
);
