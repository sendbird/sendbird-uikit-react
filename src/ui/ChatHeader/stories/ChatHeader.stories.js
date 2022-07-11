import React from 'react';
import ChatHeader from '../index.jsx';

const description = `
  \`import ChatHeader from "@sendbird/uikit-react/ui/ChatHeader";\`
  \n The title of Channel
`;

export default {
  title: '@sendbird/uikit-react/ui/ChatHeader',
  component: ChatHeader,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};


export const WithControl = (arg) => <ChatHeader {...arg} />;
export const chatHeader = () => [
  <ChatHeader
    title="Headline 2"
    subTitle="Body text 2"
    isMuted="true"
  />,
  <ChatHeader
    title="Headline 2"
    subTitle="Body text 2"
    isActive="true"
  />,
  <ChatHeader
    title="Headline 2"
    subTitle="Body text 2"
    isMuted="true"
    isActive="true"
  />,
];
export const overFlowChatHaeder = () => [
  <ChatHeader
    title="AaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAa"
  />,
  <ChatHeader
    subTitle="BbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBb"
  />,
  <ChatHeader
    title="AaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAa"
    subTitle="BbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBb"
  />,
  <ChatHeader
    title="AaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaA, aAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAa"
    subTitle="BbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBb"
    isMuted="true"
    isActive="true"
  />,
];
