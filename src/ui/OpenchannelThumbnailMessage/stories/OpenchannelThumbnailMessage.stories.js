import React from 'react';
import OpenchannelThumbnailMessage from '../index.tsx';
import { mockMessage, getMockMessage, getMockMessageWithVideo } from '../dummyData.mock';
import { MenuRoot } from '../../ContextMenu';

const description = `
  \`import OpenchannelThumbnailMessage from "@sendbird/uikit-react/ui/OpenchannelThumbnailMessage";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/OpenchannelThumbnailMessage',
  component: OpenchannelThumbnailMessage,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const userId = mockMessage.sender.userId;

export const WithControl = (arg) => (
  <OpenchannelThumbnailMessage
    message={mockMessage}
    userId={userId}
    {...arg}
  />
);

export const defaultThumbnailMessage = () => (
  <div>
    <OpenchannelThumbnailMessage
      message={mockMessage}
      userId={userId}
    />
    <OpenchannelThumbnailMessage
      message={getMockMessageWithVideo()}
      userId={userId}
    />
    <OpenchannelThumbnailMessage
      message={mockMessage}
      userId={userId}
      chainTop
    />
    <OpenchannelThumbnailMessage
      message={getMockMessageWithVideo()}
      userId={userId}
      chainTop
    />
    <OpenchannelThumbnailMessage
      message={getMockMessageWithVideo()}
      userId={userId}
      status="pending"
    />
    <OpenchannelThumbnailMessage
      message={getMockMessageWithVideo((message) => {
        message.isResendable = () => true;
      })}
      userId={userId}
      status="failed"
    />
    <MenuRoot />
  </div>
);

export const emptyThumbnailMessage = () => {
  const mock = getMockMessage();
  mock.url = '';
  const mock2 = getMockMessageWithVideo();
  mock2.url = '';
  const mock3 = getMockMessageWithVideo();
  mock3.type = '';
  return (
    <div>
      <OpenchannelThumbnailMessage
        message={mock}
      />
      <OpenchannelThumbnailMessage
        message={mock2}
        chainTop
      />
      <OpenchannelThumbnailMessage
        message={mock3}
      />
    </div>
  );
};

