import React from 'react';
import { render } from '@testing-library/react';
import { MessageSearchUI } from '../index';
import useMessageSearch from '../../../context/hooks/useMessageSearch';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';

// Verify the customer's render props reach the search UI: renderSearchItem is invoked per result
// with the message, and the placeholder render props are used for their respective states.
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

describe('MessageSearchUI — render-prop propagation (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invokes a custom renderSearchItem for each result with the message', () => {
    const messages = [
      { messageId: 1, messageType: 'user' },
      { messageId: 2, messageType: 'file' },
    ];
    const renderSearchItem = vi.fn(() => <div data-testid="custom-item" />);

    renderUI({ allMessages: messages }, { renderSearchItem });

    expect(renderSearchItem).toHaveBeenCalledWith(expect.objectContaining({ message: messages[0] }));
    expect(renderSearchItem).toHaveBeenCalledWith(expect.objectContaining({ message: messages[1] }));
  });

  it('invokes a custom renderPlaceHolderError on an invalid search', () => {
    const renderPlaceHolderError = vi.fn(() => <div data-testid="custom-error" />);

    renderUI({ isInvalid: true }, { renderPlaceHolderError });

    expect(renderPlaceHolderError).toHaveBeenCalled();
  });

  it('invokes a custom renderPlaceHolderEmptyList when the search returns no results', () => {
    const renderPlaceHolderEmptyList = vi.fn(() => <div data-testid="custom-empty" />);

    renderUI({ allMessages: [] }, { renderPlaceHolderEmptyList });

    expect(renderPlaceHolderEmptyList).toHaveBeenCalled();
  });

  it.each([
    ['an invalid search', { isInvalid: true }, 'renderPlaceHolderError'],
    ['a search in flight', { loading: true }, 'renderPlaceHolderLoading'],
    ['an empty search string', { searchString: '' }, 'renderPlaceHolderNoString'],
  ])('renders %s through its placeholder prop and no search item', (_label, state, placeholderProp) => {
    const renderSearchItem = vi.fn(() => <div />);
    const placeholder = vi.fn(() => <div data-testid="placeholder" />);

    const { getByTestId } = renderUI(
      { ...(state as object), allMessages: [{ messageId: 1, messageType: 'user' }] },
      { renderSearchItem, [placeholderProp as string]: placeholder },
    );

    expect(placeholder).toHaveBeenCalled();
    expect(getByTestId('placeholder')).toBeTruthy();
    expect(renderSearchItem).not.toHaveBeenCalled();
  });
});
