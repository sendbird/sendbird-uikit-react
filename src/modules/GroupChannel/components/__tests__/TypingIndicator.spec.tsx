import React from 'react';
import { act, render, screen } from '@testing-library/react';

import TypingIndicator from '../TypingIndicator';

const mockAddGroupChannelHandler = jest.fn();
const mockRemoveGroupChannelHandler = jest.fn();
const mockLogger = { info: jest.fn() };

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: {
      stores: {
        sdkStore: {
          sdk: {
            groupChannel: {
              addGroupChannelHandler: mockAddGroupChannelHandler,
              removeGroupChannelHandler: mockRemoveGroupChannelHandler,
            },
          },
        },
      },
      config: { logger: mockLogger },
    },
  })),
}));

describe('TypingIndicator', () => {
  beforeEach(() => {
    mockAddGroupChannelHandler.mockClear();
    mockRemoveGroupChannelHandler.mockClear();
    mockLogger.info.mockClear();
  });

  it('cleans up the registered group channel handler', () => {
    const { unmount } = render(<TypingIndicator channelUrl="channel-1" />);
    const [registeredHandlerId] = mockAddGroupChannelHandler.mock.calls[0];

    unmount();

    expect(mockRemoveGroupChannelHandler).toHaveBeenCalledWith(registeredHandlerId);
  });

  it('updates typing text for the matching channel only', () => {
    render(<TypingIndicator channelUrl="channel-1" />);
    const [, handler] = mockAddGroupChannelHandler.mock.calls[0];

    act(() => {
      handler.onTypingStatusUpdated({
        url: 'other-channel',
        getTypingUsers: () => [{ nickname: 'Other' }],
      });
    });
    expect(screen.queryByText(/Other/)).toBeNull();

    act(() => {
      handler.onTypingStatusUpdated({
        url: 'channel-1',
        getTypingUsers: () => [{ nickname: 'Jay' }],
      });
    });
    expect(screen.getByText(/Jay/)).toBeInTheDocument();
  });
});
