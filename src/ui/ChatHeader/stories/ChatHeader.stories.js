import React from 'react';
import ChatHeader from '../index.jsx';

export default { title: 'UI Components/ChatHeader' };

export const defaultChatHeader = () => <ChatHeader />;
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
