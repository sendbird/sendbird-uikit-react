import React from 'react';
import FileViewer from '../index.jsx';

import { msg0 } from '../data.mock';

const description = `
  \`import FileViewer from "@sendbird/uikit-react/ui/FileViewer";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/FileViewer',
  component: FileViewer,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <FileViewer
    {...arg}
    onClose={() => { setShow(false); }}
    onDelete={() => { setShow(false); }}
    message={msg0}
  />
);
