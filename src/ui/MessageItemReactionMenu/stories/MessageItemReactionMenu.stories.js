import React from 'react';
import { EmojiReactionListRoot } from '../../ContextMenu';
import MessageItemReactionMenu from '../index.tsx';

export default { title: 'UI Components/MessageItemReactionMenu' };

export const withText = () => (
  <div>
    <EmojiReactionListRoot />
    <MessageItemReactionMenu
      message={{
        message: 'I am message haha',
        reactions: [
          { key: 'emoji1', userIds: ['hoon-army-001', 'hoon-army-002'] },
          { key: 'emoji2', userIds: ['sravan-001', 'sravan-002'] },
        ],
      }}
      userId="hoon-army-001"
      contextMenuProps={{
        emojiContainer: {
          emojiCategories: [
            { emojis: [ { key: 'emoji1', url: '' } ] },
            { emojis: [ { key: 'emoji2', url: '' } ] },
          ],
        },
        toggleReaction: (message, key, isReacted) => alert(`${message.message} ${key} ${isReacted ? 'true' : 'false'}`),
      }}
    />
  </div>
);
