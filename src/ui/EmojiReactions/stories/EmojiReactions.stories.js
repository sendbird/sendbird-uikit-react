import React from 'react';
import EmojiReactions from '../index.jsx';

export default { title: 'UI Components/EmojiReactions' };
const messageReactions = [
  {
    key: '001-004',
    userIds: [
      'hoon300',
      'hoon301',
      'hoon302',
      'hoon303',
    ],
  },
  {
    key: '001-006',
    userIds: [
      'hoon300',
      'hoon301',
    ],
  },
];

const messageReactions2 = [
  {
    key: '001-001',
    userIds: [
      'hoon300',
      'hoon301',
      'hoon302',
    ],
  },
  {
    key: '001-002',
    userIds: [
      'hoon300',
      'hoon301',
      'hoon302',
      'hoon303',
      'hoon304',
    ],
  },
  {
    key: '003-006',
    userIds: [
      'hoon300',
      'hoon301',
      'hoon303',
    ],
  },
];

const emojiList = [
  {
    key: '001-001',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    key: '001-002',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    key: '001-003',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    key: '001-004',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    key: '001-005',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    key: '001-006',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    key: '002-001',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    key: '002-002',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    key: '002-003',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    key: '002-004',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    key: '002-005',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    key: '002-006',
    url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
];

const emojiMap = new Map();
emojiMap.set('001-001', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");
emojiMap.set('001-002', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");
emojiMap.set('001-003', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");
emojiMap.set('001-004', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");
emojiMap.set('001-005', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");
emojiMap.set('001-006', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");
emojiMap.set('002-001', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");
emojiMap.set('002-002', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");
emojiMap.set('002-003', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");
emojiMap.set('002-004', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");
emojiMap.set('002-005', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");
emojiMap.set('002-006', "https://static.sendbird.com/sample/profiles/profile_12_512px.png");

export const withText = () => [
  <EmojiReactions
    userId="hoon302"
    messageReactions={messageReactions}
    emojiAllList={emojiList}
    emojiAllMap={emojiMap}
    message={{}}
  />,
  <p />,
  <EmojiReactions
    userId="hoon303"
    messageReactions={messageReactions2}
    emojiAllList={emojiList}
    emojiAllMap={emojiMap}
    message={{}}
  />,
];
