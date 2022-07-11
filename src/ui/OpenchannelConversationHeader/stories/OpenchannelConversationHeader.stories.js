import React from 'react';
import OpenchannelConversationHeader from '../index.tsx';

const description = `
  \`import OpenchannelConversationHeader from "@sendbird/uikit-react/ui/OpenchannelConversationHeader";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/OpenchannelConversationHeader',
  component: OpenchannelConversationHeader,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <OpenchannelConversationHeader {...arg} />
);

export const filledProps = () => (
  <OpenchannelConversationHeader
    title="Open Channel Title"
    subTitle="Open Channel Subtitle"
    onActionClick={() => {
      console.log('Open Channel Trigger is clicked');
    }}
    coverImage="https://static.sendbird.com/sample/user_sdk/user_sdk_20.png"
  />
);
