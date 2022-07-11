import React from 'react';
import IconButton from '../index.jsx';

import DefaultIcon from '../../../svgs/icon-create.svg';

const description = `
  \`import IconButton from "@sendbird/uikit-react/ui/IconButton";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/IconButton',
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <IconButton onClick={() => alert("clicked the button")} {...arg}>
    <DefaultIcon />
  </IconButton>
);

export const simpleIconButton = () => (
  <IconButton onClick={() => alert("clicked the button")}>
    <DefaultIcon />
  </IconButton>
);
