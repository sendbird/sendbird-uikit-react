import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MessageSearchUI from '../components/MessageSearchUI';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import * as useMessageSearchModule from '../context/hooks/useMessageSearch';

jest.mock('../context/hooks/useMessageSearch');

const mockStringSet = {
  SEARCH_IN: 'Search in',
  SEARCH_PLACEHOLDER: 'Search',
  SEARCHING: 'Searching...',
  NO_SEARCHED_MESSAGE: 'No results found',
  NO_TITLE: 'No title',
  PLACE_HOLDER__RETRY_TO_CONNECT: 'Retry',
};

const mockLocalizationContext = {
  stringSet: mockStringSet,
};

const defaultMockState = {
  isQueryInvalid: false,
  searchString: '',
  requestString: '',
  currentChannel: null,
  loading: false,
  scrollRef: { current: null },
  hasMoreResult: false,
  onScroll: jest.fn(),
  allMessages: [],
  onResultClick: jest.fn(),
  selectedMessageId: null,
};

const defaultMockActions = {
  setSelectedMessageId: jest.fn(),
  handleRetryToConnect: jest.fn(),
};

describe('MessageSearchUI Integration Tests', () => {
  const mockUseMessageSearch = useMessageSearchModule.default as jest.Mock;

  const renderComponent = (mockState = {}, mockActions = {}) => {
    mockUseMessageSearch.mockReturnValue({
      state: { ...defaultMockState, ...mockState },
      actions: { ...defaultMockActions, ...mockActions },
    });

    return render(
      <LocalizationContext.Provider value={mockLocalizationContext as any}>
        <MessageSearchUI />
      </LocalizationContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    renderComponent();
    expect(screen.getByText('Search in')).toBeInTheDocument();
  });

  it('displays loading state when search is in progress', () => {
    renderComponent({ loading: true, searchString: 'test query', requestString: 'test query' });
    expect(screen.getByText(mockStringSet.SEARCHING)).toBeInTheDocument();
  });

  it('displays search results when available', () => {
    renderComponent({
      allMessages: [
        { messageId: 1, message: 'Message 1', sender: { nickname: 'Sender 1' } },
        { messageId: 2, message: 'Message 2', sender: { nickname: 'Sender 2' } },
      ],
      searchString: 'test query',
    });
    expect(screen.getByText('Message 1')).toBeInTheDocument();
    expect(screen.getByText('Message 2')).toBeInTheDocument();
  });

  it('handles no results state', () => {
    renderComponent({ allMessages: [], searchString: 'no results query', requestString: 'no results query' });
    expect(screen.getByText(mockStringSet.NO_SEARCHED_MESSAGE)).toBeInTheDocument();
  });

  it('handles error state and retry', async () => {
    const handleRetryToConnect = jest.fn();
    renderComponent(
      { isQueryInvalid: true, searchString: 'error query', requestString: 'error query' },
      { handleRetryToConnect },
    );
    expect(screen.getByText(mockStringSet.PLACE_HOLDER__RETRY_TO_CONNECT)).toBeInTheDocument();

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(handleRetryToConnect).toHaveBeenCalled();
  });

  it('triggers loading more messages when scrolled near bottom', async () => {
    const onScroll = jest.fn();
    const loadMoreMessages = jest.fn();
    const { container } = renderComponent({
      allMessages: [{ messageId: 1, message: 'Message 1' }],
      hasMoreResult: true,
      onScroll,
    });

    const scrollContainer = container.firstChild as Element;

    // define scroll container properties
    Object.defineProperty(scrollContainer, 'scrollHeight', { configurable: true, value: 300 });
    Object.defineProperty(scrollContainer, 'clientHeight', { configurable: true, value: 500 });
    Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, value: 450 });

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

      if (scrollTop + clientHeight >= scrollHeight - 1) {
        loadMoreMessages();
      }
    };

    fireEvent.scroll(scrollContainer);
    handleScroll({ currentTarget: scrollContainer } as React.UIEvent<HTMLDivElement>);

    expect(loadMoreMessages).toHaveBeenCalled();
  });

  it('handles message click', () => {
    const setSelectedMessageId = jest.fn();
    const onResultClick = jest.fn();
    renderComponent(
      {
        allMessages: [{ messageId: 1, message: 'Message 1', sender: { nickname: 'Sender 1' } }],
        searchString: 'Message 1',
        onResultClick,
      },
      { setSelectedMessageId },
    );

    const message = screen.getByText('Message 1');
    fireEvent.click(message);

    expect(setSelectedMessageId).toHaveBeenCalledWith(1);
    expect(onResultClick).toHaveBeenCalled();
  });
});
