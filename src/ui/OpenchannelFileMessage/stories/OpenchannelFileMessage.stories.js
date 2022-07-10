import React from 'react';
import OpenchannelFileMessage from '../index.tsx';
import {
  dummyFileMessageImage,
  dummyFileMessageAudio,
} from '../mockMessages';
import { MenuRoot } from '../../ContextMenu';

const description = `
  \`import OpenchannelFileMessage from "@sendbird/uikit-react/ui/OpenchannelFileMessage";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/OpenchannelFileMessage',
  component: OpenchannelFileMessage,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const currentUserId = dummyFileMessageImage.sender.userId;
dummyFileMessageImage.isResendable = () => true;

export const WithControl = (arg) => (
  <OpenchannelFileMessage
    message={dummyFileMessageImage}
    userId={currentUserId}
    {...arg}
  />
);

export const fileMessageImage = () => ([
  <OpenchannelFileMessage
    message={dummyFileMessageImage}
    userId={currentUserId}
  />,
  <OpenchannelFileMessage
    message={dummyFileMessageImage}
    userId={currentUserId}
    status="pending"
  />,
  <OpenchannelFileMessage
    message={dummyFileMessageImage}
    userId={currentUserId}
    status="failed"
  />,
  <MenuRoot />,
]);

export const fileMessageAudio = () => ([
  <OpenchannelFileMessage
    message={dummyFileMessageAudio}
    userId={currentUserId}
  />,
  <OpenchannelFileMessage
    message={dummyFileMessageAudio}
    userId={currentUserId}
    status="pending"
  />,
  <OpenchannelFileMessage
    message={dummyFileMessageAudio}
    userId={currentUserId}
    status="failed"
  />,
  <MenuRoot />,
]);

export const chainedFileMessages = () => [
  <OpenchannelFileMessage
    message={dummyFileMessageAudio}
  />,
  <OpenchannelFileMessage
    message={dummyFileMessageAudio}
    chainTop
  />,
  <OpenchannelFileMessage
    message={dummyFileMessageImage}
  />,
  <OpenchannelFileMessage
    message={dummyFileMessageImage}
    chainTop
  />,
];
