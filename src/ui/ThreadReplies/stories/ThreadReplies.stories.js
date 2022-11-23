import React from 'react';
import ThreadReplies from '../index';

const description = `
  \`import ThreadReplies from "@sendbird/uikit-react/ui/ThreadReplies";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/ThreadReplies',
  component: ThreadReplies,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const withControl = (arg) => (
  <ThreadReplies
    threadInfo={{
      mostRepliedUsers: [
        { profileUrl: 'https://file-ap-1.sendbird.com/9ed7a17fcfa64563a7c25c3e5156f448.jpg' },
      ],
      replyCount: 1,
    }}
    {...arg}
  />
);

export const fullStack = () => (
  <ThreadReplies
    threadInfo={{
      mostRepliedUsers: [
        { profileUrl: 'https://file-ap-1.sendbird.com/9ed7a17fcfa64563a7c25c3e5156f448.jpg' },
        { profileUrl: 'https://static.sendbird.com/sample/user_sdk/user_sdk_22.png' },
        { profileUrl: 'https://static.sendbird.com/sample/user_sdk/user_sdk_23.png' },
        { profileUrl: 'https://file-ap-1.sendbird.com/e7e4e55e91dd47fba5af972595ef0cc9.jpg' },
        { profileUrl: 'https://file-ap-1.sendbird.com/9ed7a17fcfa64563a7c25c3e5156f448.jpg' },
      ],
      replyCount: 100,
    }}
  />
)
