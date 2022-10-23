import React from 'react';
import BottomSheet from '../index';

const description = `
  \`import BottomSheet from "@sendbird/uikit-react/ui/BottomSheet";\`
  This is a component used in Mobile UI
`;

export default {
  title: '@sendbird/uikit-react/ui/BottomSheet',
  component: BottomSheet,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControls = (args) => (
  <BottomSheet {...args}>
    <>Child component</>
  </BottomSheet>
)
