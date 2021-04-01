import React from 'react';
import OpenchannelOGMessage from '../index.tsx';
import { MenuRoot } from '../../ContextMenu';

export default { title: 'UI Components/OpenchannelOGMessage' };

const userId = 'hh-1234';
const defaultMessage = {
  messageType: 'user',
  message: 'sendbird.com A Van Allen radiation belt is a zone of energetic charged particles, most of which orginate from the solar wind, that are captured by held around a planet',
  createdAt: 11111110,
  updatedAt: 0,
  ogMetaData: {
    url: 'https://sendbird.com/',
    title: 'This is the TITLE',
    description: 'I am description I an who has much string in this og meta data',
    defaultImage: {
      url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
      alt: 'test',
    },
  },
  sender: {
    profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
    friendName: 'Hamtory',
    nickname: 'Ham',
    userId,
  },
  isResendable: () => true,
};

export const defaultOpenchannelOGMessage = () => ([
  <OpenchannelOGMessage
    message={defaultMessage}
    userId={userId}
  />,
  <OpenchannelOGMessage
    message={defaultMessage}
    userId={userId}
    status="pending"
  />,
  <OpenchannelOGMessage
    message={defaultMessage}
    userId={userId}
    status="failed"
  />,
  <MenuRoot />,
]);

export const openchannelOGMessagesWithChainTop = () => [
  <OpenchannelOGMessage
    message={{
      messageType: 'user',
      message: 'sendbird.com A Van Allen radiation belt is a zone of energetic charged particles, most of which orginate from the solar wind, that are captured by held around a planet',
      createdAt: 11111110,
      updatedAt: 0,
      ogMetaData: {
        url: 'https://sendbird.com/',
        title: 'This is the TITLE',
        description: 'I am description I an who has much string in this og meta data',
        defaultImage: {
          url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
          alt: 'test',
        },
      },
      sender: {
        profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
        friendName: 'Hamtory',
        nickname: 'Ham',
        userId: 'hh-1234',
      },
      isResendable: () => false,
    }}
  />,
  <OpenchannelOGMessage
    message={{
      messageType: 'user',
      message: 'sendbird.com A Van Allen radiation belt is a zone of energetic charged particles, most of which orginate from the solar wind, that are captured by held around a planet',
      createdAt: 11111110,
      updatedAt: 0,
      ogMetaData: {
        url: 'https://sendbird.com/',
        title: 'This is the TITLE',
        description: 'I am description I an who has much string in this og meta data',
        defaultImage: {
          url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
          alt: 'test',
        },
      },
      sender: {
        profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
        friendName: 'Hamtory',
        nickname: 'Ham',
        userId: 'hh-1234',
      },
      isResendable: () => false,
    }}
    chainTop
  />,
  <OpenchannelOGMessage
    message={{
      messageType: 'user',
      message: 'sendbird.com A Van Allen radiation belt is a zone of energetic charged particles, most of which orginate from the solar wind, that are captured by held around a planet',
      createdAt: 11111110,
      updatedAt: 0,
      ogMetaData: {
        url: 'https://sendbird.com/',
        title: 'This is the TITLE',
        description: 'I am description I an who has much string in this og meta data',
        defaultImage: {
          url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
          alt: 'test',
        },
      },
      sender: {
        profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
        friendName: 'Hamtory',
        nickname: 'Ham',
        userId: 'hh-1234',
      },
      isResendable: () => false,
    }}
  />,
];
