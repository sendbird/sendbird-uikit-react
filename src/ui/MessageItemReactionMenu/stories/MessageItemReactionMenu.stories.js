import React from 'react';
import { EmojiReactionListRoot } from '../../ContextMenu';
import MessageItemReactionMenu from '../index.tsx';

const description = `
  \`import MessageItemReactionMenu from "@sendbird/uikit-react/ui/MessageItemReactionMenu";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/MessageItemReactionMenu',
  component: MessageItemReactionMenu,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const message = {
  message: 'I am message haha',
  reactions: [
    { key: 'emoji1', userIds: ['hoon-army-001', 'hoon-army-002'] },
    { key: 'emoji2', userIds: ['sravan-001', 'sravan-002'] },
  ],
};

const contextMenuProps = {
  emojiContainer: {
    emojiCategories: [
      { emojis: [ { key: 'emoji1', url: '' } ] },
      { emojis: [ { key: 'emoji2', url: '' } ] },
    ],
  },
  toggleReaction: (message, key, isReacted) => alert(`${message.message} ${key} ${isReacted ? 'true' : 'false'}`),
};

export const WithControl = (arg) => (
  <div>
    <EmojiReactionListRoot />
    <MessageItemReactionMenu
      message={message}
      contextMenuProps={contextMenuProps}
      {...arg}
    />
  </div>
);

export const withText = () => (
  <div>
    <EmojiReactionListRoot />
    <MessageItemReactionMenu
      message={message}
      userId="hoon-army-001"
      contextMenuProps={contextMenuProps}
    />
  </div>
);
