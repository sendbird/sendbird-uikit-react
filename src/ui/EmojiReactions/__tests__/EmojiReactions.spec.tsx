import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import EmojiReactions from '../index';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../../lib/MediaQueryContext';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { useGlobalModalContext } from '../../../hooks/useModal';

const mockUseMediaQueryContext = useMediaQueryContext as jest.Mock;
const mockUseSendbird = useSendbird as jest.Mock;
const mockUseGlobalModalContext = useGlobalModalContext as jest.Mock;
const mockOpenModal = jest.fn();

jest.mock('../../../lib/MediaQueryContext', () => ({
  useMediaQueryContext: jest.fn(),
}));

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../hooks/useModal', () => ({
  useGlobalModalContext: jest.fn(),
}));

jest.mock('../../../hooks/useLongPress', () => ({
  __esModule: true,
  default: jest.fn((handlers) => ({
    onClick: handlers.onClick,
    onMouseDown: handlers.onLongPress,
  })),
}));

jest.mock('../../../utils/getIsReactionEnabled', () => ({
  getIsReactionEnabled: jest.fn(() => true),
}));

jest.mock('../../ReactionBadge', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef(({ children, onClick, testID, count, selected, isAdd, className }: any, ref: any) => React.createElement(
      'button',
      {
        ref,
        type: 'button',
        className,
        'data-testid': testID || (isAdd ? 'reaction-add' : `reaction-${selected ? 'selected' : 'plain'}-${count ?? 0}`),
        onClick,
      },
      children,
      count ?? null,
    )),
  };
});

jest.mock('../../ReactionButton', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, onClick, testID, selected }: any) => React.createElement(
      'button',
      { type: 'button', 'data-testid': testID, 'aria-pressed': selected, onClick },
      children,
    ),
  };
});

jest.mock('../../ImageRenderer', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ url, defaultComponent, placeHolder }: any) => React.createElement(
      'span',
      { 'data-testid': `image-${url || 'empty'}` },
      url || defaultComponent || placeHolder?.({ style: {} }),
    ),
  };
});

jest.mock('../../Icon', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ type }: any) => React.createElement('span', null, String(type)),
    IconColors: new Proxy({}, { get: (_target, key) => key }),
    IconTypes: new Proxy({}, { get: (_target, key) => key }),
  };
});

jest.mock('../../ContextMenu', () => {
  const React = require('react');
  const closeDropdown = jest.fn();
  return {
    __esModule: true,
    default: ({ menuTrigger, menuItems }: any) => React.createElement(
      'div',
      null,
      menuTrigger?.(jest.fn()),
      menuItems?.(closeDropdown),
    ),
    EmojiListItems: ({ children }: any) => React.createElement('div', { 'data-testid': 'emoji-list-items' }, children),
  };
});

jest.mock('../../Tooltip', () => {
  const React = require('react');
  return { __esModule: true, default: ({ children }: any) => React.createElement('span', { 'data-testid': 'tooltip' }, children) };
});

jest.mock('../../TooltipWrapper', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, hoverTooltip, className }: any) => React.createElement(
      'div',
      { className },
      hoverTooltip,
      children,
    ),
  };
});

jest.mock('../../MobileMenu/ReactedMembersBottomSheet', () => {
  const React = require('react');
  return {
    ReactedMembersBottomSheet: ({ emojiKey, hideMenu }: any) => React.createElement(
      'div',
      { 'data-testid': 'reacted-members-sheet' },
      emojiKey,
      React.createElement('button', { type: 'button', onClick: hideMenu }, 'hide reacted members'),
    ),
  };
});

jest.mock('../../MobileMenu/MobileEmojisBottomSheet', () => {
  const React = require('react');
  return {
    MobileEmojisBottomSheet: ({ hideMenu, toggleReaction, message }: any) => React.createElement(
      'div',
      { 'data-testid': 'mobile-emojis-sheet' },
      React.createElement('button', {
        type: 'button',
        onClick: () => {
          toggleReaction?.(message, 'like', false);
          hideMenu?.();
        },
      }, 'pick mobile emoji'),
    ),
  };
});

jest.mock('../../Modal', () => {
  const React = require('react');
  return {
    ModalFooter: ({ submitText, onSubmit }: any) => React.createElement('button', { type: 'button', onClick: onSubmit }, submitText),
  };
});

jest.mock('../../Button', () => ({
  ButtonTypes: new Proxy({}, { get: (_target, key) => key }),
}));

jest.mock('../../../modules/Message/context/MessageProvider', () => ({
  useMessageContext: jest.fn(() => ({ message: { messageId: 99 } })),
}));

const emojiContainer = {
  emojiCategories: [
    { id: 1, emojis: [{ key: 'like', url: 'like.png' }, { key: 'smile', url: 'smile.png' }] },
    { id: 2, emojis: [{ key: 'wave', url: 'wave.png' }] },
  ],
};
const message = {
  messageId: 1,
  reactions: [
    { key: 'like', userIds: ['current-user', 'member-1'] },
    { key: 'wave', userIds: ['member-2'] },
  ],
};
const channel = {
  isGroupChannel: jest.fn(() => true),
  isSuper: false,
};
const memberNicknamesMap = new Map([
  ['member-1', 'Jane'],
  ['member-2', 'Kai'],
]);
const stringSet = {
  BUTTON__OK: 'OK',
  TOOLTIP__AND_YOU: 'and you',
  TOOLTIP__UNKNOWN_USER: 'Unknown',
};

const renderComponent = (props = {}) => render(
  <LocalizationContext.Provider value={{ stringSet } as any}>
    <EmojiReactions
      userId="current-user"
      message={message as any}
      channel={channel as any}
      emojiContainer={emojiContainer as any}
      memberNicknamesMap={memberNicknamesMap}
      toggleReaction={jest.fn()}
      {...props}
    />
  </LocalizationContext.Provider>,
);

describe('EmojiReactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOpenModal.mockClear();
    mockUseGlobalModalContext.mockReturnValue({ openModal: mockOpenModal });
    mockUseSendbird.mockReturnValue({
      state: {
        config: {
          userId: 'current-user',
          groupChannel: { enableReactions: true },
        },
      },
    });
    mockUseMediaQueryContext.mockReturnValue({ isMobile: false });
  });

  it('renders desktop reactions, blocks filtered unreacted items, and toggles menu emojis', () => {
    const toggleReaction = jest.fn();
    renderComponent({
      toggleReaction,
      filterEmojiCategoryIds: () => [1],
      className: ['custom-class'],
      isByMe: true,
    });

    fireEvent.click(screen.getByTestId('reaction-selected-2'));
    expect(toggleReaction).toHaveBeenCalledWith(message, 'like', true);

    fireEvent.click(screen.getByTestId('reaction-plain-1'));
    expect(mockOpenModal).toHaveBeenCalledWith(expect.objectContaining({
      modalProps: expect.objectContaining({ titleText: 'Add reaction failed' }),
    }));

    fireEvent.click(screen.getByTestId('sendbird-emoji-reactions__add-reaction-badge'));
    fireEvent.click(screen.getByTestId('ui_emoji_reactions_menu_smile'));
    expect(toggleReaction).toHaveBeenCalledWith(message, 'smile', false);
  });

  it('renders mobile add emoji and reacted member sheets', () => {
    const toggleReaction = jest.fn();
    mockUseMediaQueryContext.mockReturnValue({ isMobile: true });

    renderComponent({ toggleReaction });

    fireEvent.click(screen.getByTestId('sendbird-emoji-reactions__add-reaction-badge'));
    expect(screen.getByTestId('mobile-emojis-sheet')).toBeInTheDocument();
    fireEvent.click(screen.getByText('pick mobile emoji'));
    expect(toggleReaction).toHaveBeenCalledWith(message, 'like', false);

    fireEvent.mouseDown(screen.getByTestId('reaction-selected-2').parentElement as Element);
    expect(screen.getByTestId('reacted-members-sheet')).toHaveTextContent('like');
    fireEvent.click(screen.getByText('hide reacted members'));
    expect(screen.queryByTestId('reacted-members-sheet')).not.toBeInTheDocument();
  });

  it('falls back when Sendbird context is unavailable', () => {
    mockUseSendbird.mockImplementation(() => {
      throw new Error('missing provider');
    });

    renderComponent({
      message: {
        messageId: 2,
        reactions: [],
      },
    });

    expect(screen.getByTestId('sendbird-emoji-reactions__add-reaction-badge')).toBeInTheDocument();
  });

  it('hides the add badge when every emoji already has a reaction', () => {
    renderComponent({
      message: {
        messageId: 3,
        reactions: [
          { key: 'like', userIds: ['current-user'] },
          { key: 'smile', userIds: [] },
          { key: 'wave', userIds: [] },
        ],
      },
      channel: null,
    });

    expect(screen.queryByTestId('sendbird-emoji-reactions__add-reaction-badge')).not.toBeInTheDocument();
  });

  it('recomputes filtered add-reaction emojis when the target message changes', () => {
    const filterEmojiCategoryIds = jest.fn((message) => message.categoryIds);
    const firstMessage = {
      messageId: 4,
      categoryIds: [1],
      reactions: [],
    };
    const secondMessage = {
      messageId: 5,
      categoryIds: [2],
      reactions: [],
    };
    const { rerender } = renderComponent({
      message: firstMessage,
      filterEmojiCategoryIds,
    });

    expect(screen.getByTestId('ui_emoji_reactions_menu_smile')).toBeInTheDocument();
    expect(screen.queryByTestId('ui_emoji_reactions_menu_wave')).not.toBeInTheDocument();

    rerender(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <EmojiReactions
          userId="current-user"
          message={secondMessage as any}
          channel={channel as any}
          emojiContainer={emojiContainer as any}
          memberNicknamesMap={memberNicknamesMap}
          toggleReaction={jest.fn()}
          filterEmojiCategoryIds={filterEmojiCategoryIds}
        />
      </LocalizationContext.Provider>,
    );

    expect(screen.queryByTestId('ui_emoji_reactions_menu_smile')).not.toBeInTheDocument();
    expect(screen.getByTestId('ui_emoji_reactions_menu_wave')).toBeInTheDocument();
  });
});
