import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { GroupChannelUIView } from '../components/GroupChannelUI/GroupChannelUIView';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';

jest.mock('../../../hooks/useSendbirdStateContext');

const mockUseSendbirdStateContext = useSendbirdStateContext as jest.Mock;

describe('GroupChannelUIView Integration Tests', () => {
  const defaultProps = {
    channelUrl: 'test-channel',
    isInvalid: false,
    renderChannelHeader: jest.fn(() => <div>Channel Header</div>),
    renderMessageList: jest.fn(() => <div>Message List</div>),
    renderMessageInput: jest.fn(() => <div>Message Input</div>),
  };

  beforeEach(() => {
    mockUseSendbirdStateContext.mockImplementation(() => ({
      stores: {
        sdkStore: { error: null },
      },
      config: {
        logger: { info: jest.fn() },
        isOnline: true,
        groupChannel: {
          enableTypingIndicator: true,
          typingIndicatorTypes: new Set(['text']),
        },
      },
    }));
  });

  it('renders basic channel components correctly', () => {
    render(<GroupChannelUIView {...defaultProps} />);

    expect(screen.getByText('Channel Header')).toBeInTheDocument();
    expect(screen.getByText('Message List')).toBeInTheDocument();
    expect(screen.getByText('Message Input')).toBeInTheDocument();
  });

  it('renders loading placeholder when isLoading is true', () => {
    render(<GroupChannelUIView {...defaultProps} isLoading={true} />);
    // Placeholder is a just loading spinner in this case
    expect(screen.getByRole('button')).toHaveClass('sendbird-icon-spinner');
  });

  it('renders invalid placeholder when channelUrl is missing', () => {
    render(<GroupChannelUIView {...defaultProps} channelUrl="" />);
    expect(screen.getByText('No channels')).toBeInTheDocument();
  });

  it('renders error placeholder when isInvalid is true', () => {
    render(<GroupChannelUIView {...defaultProps} isInvalid={true} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders SDK error placeholder when SDK has error', () => {
    mockUseSendbirdStateContext.mockImplementation(() => ({
      stores: {
        sdkStore: { error: new Error('SDK Error') },
      },
      config: {
        logger: { info: jest.fn() },
        isOnline: true,
      },
    }));

    render(<GroupChannelUIView {...defaultProps} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('renders custom placeholders when provided', () => {
    const renderPlaceholderLoader = () => <div>Custom Loader</div>;
    const renderPlaceholderInvalid = () => <div>Custom Invalid</div>;

    const { rerender } = render(
      <GroupChannelUIView
        {...defaultProps}
        isLoading={true}
        renderPlaceholderLoader={renderPlaceholderLoader}
      />,
    );
    expect(screen.getByText('Custom Loader')).toBeInTheDocument();

    rerender(
      <GroupChannelUIView
        {...defaultProps}
        isInvalid={true}
        renderPlaceholderInvalid={renderPlaceholderInvalid}
      />,
    );
    expect(screen.getByText('Custom Invalid')).toBeInTheDocument();
  });
});
