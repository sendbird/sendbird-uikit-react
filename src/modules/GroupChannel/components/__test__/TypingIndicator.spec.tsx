import React from 'react';
import { render } from '@testing-library/react';

import { TypingIndicator } from '../TypingIndicator';

const { mockAddGroupChannelHandler, mockRemoveGroupChannelHandler, mockState } = vi.hoisted(() => {
  const mockAddGroupChannelHandler = vi.fn();
  const mockRemoveGroupChannelHandler = vi.fn();
  const mockState = {
    stores: {
      sdkStore: {
        sdk: {
          groupChannel: {
            addGroupChannelHandler: mockAddGroupChannelHandler,
            removeGroupChannelHandler: mockRemoveGroupChannelHandler,
          },
        },
        initialized: true,
      },
    },
    config: {
      logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() },
    },
  };
  return { mockAddGroupChannelHandler, mockRemoveGroupChannelHandler, mockState };
});

vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
}));

describe('GroupChannel/TypingIndicator group channel handler lifecycle (CLNP-8774)', () => {
  beforeEach(() => {
    mockAddGroupChannelHandler.mockClear();
    mockRemoveGroupChannelHandler.mockClear();
  });

  it('removes the exact handler id it registered when unmounted, so the handler does not leak', () => {
    const { unmount } = render(<TypingIndicator channelUrl="channel-a" />);

    expect(mockAddGroupChannelHandler).toHaveBeenCalledTimes(1);
    const registeredId = mockAddGroupChannelHandler.mock.calls[0][0];
    expect(registeredId).toBeTruthy();

    unmount();

    expect(mockRemoveGroupChannelHandler).toHaveBeenCalledWith(registeredId);
  });

  it('removes every registered handler across a channel switch followed by unmount (no leak)', () => {
    const { rerender, unmount } = render(<TypingIndicator channelUrl="channel-a" />);
    rerender(<TypingIndicator channelUrl="channel-b" />);

    expect(mockAddGroupChannelHandler).toHaveBeenCalledTimes(2);
    const firstId = mockAddGroupChannelHandler.mock.calls[0][0];
    const secondId = mockAddGroupChannelHandler.mock.calls[1][0];
    expect(firstId).not.toBe(secondId);

    unmount();

    expect(mockRemoveGroupChannelHandler).toHaveBeenCalledWith(firstId);
    expect(mockRemoveGroupChannelHandler).toHaveBeenCalledWith(secondId);
  });
});
