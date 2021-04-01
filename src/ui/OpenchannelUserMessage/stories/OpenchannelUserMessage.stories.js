import React from 'react';
import OpenchannelUserMessage from '../index.tsx';
import { MenuRoot } from '../../ContextMenu';

export default { title: 'UI Components/OpenchannelUserMessage' };

const getMockMessage = (callback) => {
  const message = {
    message: 'A Van Allen radiation belt is a zone of energetic charged particles, most of which orginate from the solar wind, that are captured by held around a planet',
    messageType: 'user',
    updatedAt: 0,
    sender: {
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
      friendName: 'Hamtory',
      nickname: 'Ham',
      userId: 'hh-1234',
    },
    createdAt: 10000000,
    isResendable: () => { },
  };
  if (callback && typeof callback === 'function') {
    callback(message);
  }
  return message;
}
const userId = getMockMessage().sender.userId;

export const defaultUserMessage = () => (
  <div>
    <OpenchannelUserMessage
      message={getMockMessage()}
    />
    <OpenchannelUserMessage
      message={getMockMessage((message) => {
        message.isResendable = () => true;
      })}
      userId={userId}
      status="pending"
    />
    <OpenchannelUserMessage
      message={getMockMessage((message) => {
        message.isResendable = () => true;
      })}
      userId={userId}
      status="failed"
    />
    <MenuRoot />
  </div>
);

export const chainUserMessages = () => [
  <OpenchannelUserMessage
    message={getMockMessage((message) => {
      message.message = "Single";
    })}
  />,
  <OpenchannelUserMessage
    message={getMockMessage()}
    chainTop
  />,
];
