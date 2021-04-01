import React from 'react';
import OpenchannelFileMessage from '../index.tsx';
import {
  dummyFileMessageImage,
  dummyFileMessageAudio,
} from '../mockMessages';
import { MenuRoot } from '../../ContextMenu';

export default { title: 'UI Components/OpenchannelFileMessage' };
const currentUserId = dummyFileMessageImage.sender.userId;
dummyFileMessageImage.isResendable = () => true;

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
