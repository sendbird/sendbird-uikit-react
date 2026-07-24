import React from 'react';
import { render } from '@testing-library/react';
import { MessageSearchUI } from '../index';
import useMessageSearch from '../../../context/hooks/useMessageSearch';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';

// Regression guard for keying the custom renderSearchItem branch. Before the fix that branch
// returned the element with no key (the built-in item branches use key={message.messageId}), so
// React logged the "unique key" warning and risked mis-keyed list reconciliation. Rendering
// several custom items must emit no such warning — this fails on the pre-fix code.
vi.mock('../../../context/hooks/useMessageSearch', () => ({ __esModule: true, default: vi.fn() }));

const stringSet = { NO_TITLE: 'No title', NO_NAME: 'No name' } as any;

const baseState = {
  isInvalid: false,
  searchString: 'hello',
  requestString: 'hello',
  currentChannel: { name: 'ch', members: [] },
  loading: false,
  scrollRef: { current: null },
  hasMoreResult: false,
  onScroll: vi.fn(),
  allMessages: [],
  onResultClick: vi.fn(),
  selectedMessageId: null,
};

const renderUI = (state: Record<string, unknown> = {}, uiProps: Record<string, unknown> = {}) => {
  vi.mocked(useMessageSearch).mockReturnValue({
    state: { ...baseState, ...state },
    actions: { setSelectedMessageId: vi.fn(), handleRetryToConnect: vi.fn() },
  } as any);
  return render(
    <LocalizationContext.Provider value={{ stringSet } as any}>
      <MessageSearchUI {...uiProps} />
    </LocalizationContext.Provider>,
  );
};

describe('MessageSearchUI — custom renderSearchItem keying (regression)', () => {
  it('emits no React "unique key" warning when rendering multiple custom search items', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const messages = [
      { messageId: 1, messageType: 'user' },
      { messageId: 2, messageType: 'user' },
      { messageId: 3, messageType: 'file' },
    ];
    // The customer's item carries no key of its own — the list must supply one.
    const renderSearchItem = vi.fn(() => <div data-testid="custom-item" />);

    renderUI({ allMessages: messages }, { renderSearchItem });

    const keyWarning = consoleErrorSpy.mock.calls.find(
      ([first]) => typeof first === 'string' && /each child in a list should have a unique/i.test(first),
    );
    expect(keyWarning).toBeUndefined();

    consoleErrorSpy.mockRestore();
  });
});
