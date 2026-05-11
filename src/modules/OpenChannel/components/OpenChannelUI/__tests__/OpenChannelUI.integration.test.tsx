import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import OpenChannelUI from '../index';
import { useOpenChannelContext } from '../../../context/OpenChannelProvider';

function mockOpenChannelMessageList() {
  return <div>Message List</div>;
}

function mockOpenChannelHeader() {
  return <div>Default Header</div>;
}

function mockOpenChannelInput() {
  return <div>Default Input</div>;
}

function mockFrozenChannelNotification() {
  return <div>Frozen Notice</div>;
}

jest.mock('../../../context/OpenChannelProvider', () => ({
  useOpenChannelContext: jest.fn(),
}));
jest.mock('../../OpenChannelMessageList', () => ({ __esModule: true, default: mockOpenChannelMessageList }));
jest.mock('../../OpenChannelHeader', () => ({ __esModule: true, default: mockOpenChannelHeader }));
jest.mock('../../OpenChannelInput', () => ({ __esModule: true, default: mockOpenChannelInput }));
jest.mock('../../FrozenChannelNotification', () => ({ __esModule: true, default: mockFrozenChannelNotification }));

const mockUseOpenChannelContext = useOpenChannelContext as jest.Mock;

const defaultContext = {
  currentOpenChannel: { url: 'open-channel-url', isFrozen: false },
  frozen: false,
  amIBanned: false,
  loading: false,
  isInvalid: false,
  messageInputRef: { current: null },
  conversationScrollRef: { current: null },
};

describe('OpenChannelUI integration tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOpenChannelContext.mockReturnValue(defaultContext);
  });

  it('renders the core channel layout', () => {
    render(<OpenChannelUI />);

    expect(screen.getByText('Default Header')).toBeInTheDocument();
    expect(screen.getByText('Message List')).toBeInTheDocument();
    expect(screen.getByText('Default Input')).toBeInTheDocument();
  });

  it('renders custom header and input renderers', () => {
    render(
      <OpenChannelUI
        renderHeader={() => <div>Custom Header</div>}
        renderMessageInput={() => <div>Custom Input</div>}
      />,
    );

    expect(screen.getByText('Custom Header')).toBeInTheDocument();
    expect(screen.getByText('Custom Input')).toBeInTheDocument();
    expect(screen.queryByText('Default Header')).not.toBeInTheDocument();
    expect(screen.queryByText('Default Input')).not.toBeInTheDocument();
  });

  it('renders loading and error placeholders from channel state', () => {
    mockUseOpenChannelContext.mockReturnValue({
      ...defaultContext,
      loading: true,
    });
    const { rerender } = render(<OpenChannelUI renderPlaceHolderLoading={() => <div>Loading Placeholder</div>} />);
    expect(screen.getByText('Loading Placeholder')).toBeInTheDocument();

    mockUseOpenChannelContext.mockReturnValue({
      ...defaultContext,
      isInvalid: true,
    });
    rerender(<OpenChannelUI renderPlaceHolderError={() => <div>Error Placeholder</div>} />);
    expect(screen.getByText('Error Placeholder')).toBeInTheDocument();
  });

  it('keeps the loading placeholder ahead of the missing channel placeholder', () => {
    mockUseOpenChannelContext.mockReturnValue({
      ...defaultContext,
      currentOpenChannel: null,
      loading: true,
    });

    render(
      <OpenChannelUI
        renderPlaceHolderLoading={() => <div>Loading Placeholder</div>}
        renderPlaceHolderError={() => <div>Error Placeholder</div>}
      />,
    );

    expect(screen.getByText('Loading Placeholder')).toBeInTheDocument();
    expect(screen.queryByText('Error Placeholder')).not.toBeInTheDocument();
  });

  it('keeps the invalid placeholder ahead of the missing channel placeholder', () => {
    mockUseOpenChannelContext.mockReturnValue({
      ...defaultContext,
      currentOpenChannel: null,
      isInvalid: true,
    });

    render(
      <OpenChannelUI
        renderPlaceHolderError={() => <div>Invalid Placeholder</div>}
      />,
    );

    expect(screen.getByText('Invalid Placeholder')).toBeInTheDocument();
  });

  it('renders an error placeholder when channel is missing or current user is banned', () => {
    mockUseOpenChannelContext.mockReturnValue({
      ...defaultContext,
      currentOpenChannel: null,
    });
    const { rerender } = render(<OpenChannelUI renderPlaceHolderError={() => <div>No Channel</div>} />);
    expect(screen.getByText('No Channel')).toBeInTheDocument();

    mockUseOpenChannelContext.mockReturnValue({
      ...defaultContext,
      amIBanned: true,
    });
    rerender(<OpenChannelUI renderPlaceHolderError={() => <div>Banned Channel</div>} />);
    expect(screen.getByText('Banned Channel')).toBeInTheDocument();
  });

  it('renders frozen notification for frozen open channels', () => {
    mockUseOpenChannelContext.mockReturnValue({
      ...defaultContext,
      currentOpenChannel: { url: 'open-channel-url', isFrozen: false },
      frozen: true,
    });

    render(<OpenChannelUI />);

    expect(screen.getByText('Frozen Notice')).toBeInTheDocument();
  });
});
