import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import MessageItemReactionMenu from "../index";

describe('ui/MessageItemReactionMenu', () => {
  it('should do a snapshot test of the MessageItemReactionMenu DOM', function() {
    const { asFragment } = render(
      <MessageItemReactionMenu
        message={{ sendingStatus: 'succeeded' }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('recomputes filtered emojis when the target message changes', function() {
    const portalRoot = document.createElement('div');
    portalRoot.id = 'sendbird-emoji-list-portal';
    document.body.appendChild(portalRoot);
    const emojiContainer = {
      emojiCategories: [
        { id: 1, emojis: [{ key: 'smile', url: 'smile.png' }] },
        { id: 2, emojis: [{ key: 'heart', url: 'heart.png' }] },
      ],
    };
    const filterEmojiCategoryIds = jest.fn((message) => message.categoryIds);
    const firstMessage = {
      messageId: 1,
      sendingStatus: 'succeeded',
      categoryIds: [1],
      reactions: [],
    };
    const secondMessage = {
      messageId: 2,
      sendingStatus: 'succeeded',
      categoryIds: [2],
      reactions: [],
    };

    const { container, rerender } = render(
      <MessageItemReactionMenu
        message={firstMessage}
        userId="me"
        emojiContainer={emojiContainer}
        filterEmojiCategoryIds={filterEmojiCategoryIds}
      />
    );

    rerender(
      <MessageItemReactionMenu
        message={secondMessage}
        userId="me"
        emojiContainer={emojiContainer}
        filterEmojiCategoryIds={filterEmojiCategoryIds}
      />
    );

    fireEvent.click(container.querySelector('.sendbird-iconbutton'));

    expect(document.querySelector('[data-testid="ui_emoji_reactions_menu_smile"]')).toBeNull();
    expect(document.querySelector('[data-testid="ui_emoji_reactions_menu_heart"]')).toBeInTheDocument();

    portalRoot.remove();
  });
});
