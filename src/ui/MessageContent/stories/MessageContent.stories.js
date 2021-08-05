import React from 'react';
import MessageContent from '../index.tsx';

import { MenuRoot, EmojiReactionListRoot } from '../../ContextMenu';

export default { title: 'UI Components/MessageContent' };

export const withText = () => (
  <div>
    <MessageContent
      userId="hoon-lord-01"
      channel={{
        isGroupChannel: () => true,
        getUnreadMemberCount: (_) => 10,
        getUndeliveredMemberCount: (_) => 0,
      }}
      message={{
        message: 'i am message',
        messageType: 'user',
        sender: {
          profileUrl: '',
          nickname: 'Sendorous',
          userId: 'hoon-army-001',
          friendName: '',
        },
        createdAt: 0,
        updatedAt: 0,
        sendingStatus: 'succeeded',
        ogMetaData: null,
        reactions: [
          {
            key: 'emoji1',
            userIds: [ 'hoon-army-001', 'hoon-army-002', 'hoon-army-004' ],
          },
        ],
        // ogMetaData: { defaultImage: { url: '', alt: '' }, title: '', description: '', url: '' },
        // name: '',
        // url: '',
        // type: '',
        // thumbnails: [ { url: '' } ],
        isAdminMessage: () => false,
        isResendable: () => false,
      }}
      optionalProps={{
        // chainTop: true,
        // chainBottom: true,
        useReaction: true,
        emojiContainer: {
          emojiCategories: [
            { emojis: [ { key: 'emoji1', url: '' } ] },
            { emojis: [ { key: 'emoji2', url: '' } ] },
          ],
        },
      }}
    />
    <br />
    <br />
    <div style={{ width: '100%', textAlign: 'right' }}>
      <MessageContent
        userId="hoon-army-001"
        channel={{
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 10,
          getUndeliveredMemberCount: (_) => 0,
        }}
        message={{
          message: 'i am message',
          messageType: 'user',
          sender: {
            profileUrl: '',
            nickname: 'Sendorous',
            userId: 'hoon-army-001',
            friendName: '',
          },
          createdAt: 0,
          updatedAt: 0,
          sendingStatus: 'succeeded',
          ogMetaData: null,
          reactions: [],
          // ogMetaData: { defaultImage: { url: '', alt: '' }, title: '', description: '', url: '' },
          // name: '',
          // url: '',
          // type: '',
          // thumbnails: [ { url: '' } ],
          isAdminMessage: () => false,
          isResendable: () => false,
        }}
        optionalProps={{
          // chainTop: true,
          // chainBottom: true,
          useReaction: true,
          emojiContainer: {
            emojiCategories: [
              { emojis: [ { key: 'emoji1', url: '' } ] },
              { emojis: [ { key: 'emoji2', url: '' } ] },
            ],
          },
        }}
      />
    </div>
    <MenuRoot />
    <EmojiReactionListRoot />
  </div>
);
