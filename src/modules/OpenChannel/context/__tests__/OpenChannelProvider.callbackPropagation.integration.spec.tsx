import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { OpenChannelProvider, useOpenChannelContext } from '../OpenChannelProvider';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

// Verify that the customer's OpenChannel callbacks passed to OpenChannelProvider reach the context
// (prop -> context) unchanged. Mirrors GroupChannelProvider.callbackPropagation.integration.spec.tsx.
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({ __esModule: true, default: vi.fn() }));

const mockOpenChannel = {
  url: 'test-channel',
  enter: vi.fn().mockResolvedValue(undefined),
  exit: vi.fn().mockResolvedValue(undefined),
  isOperator: vi.fn(() => false),
  getMyMutedInfo: vi.fn().mockResolvedValue({ isMuted: false }),
  participantCount: 0,
  createParticipantListQuery: vi.fn(() => ({ hasNext: false, next: vi.fn().mockResolvedValue([]) })),
  createBannedUserListQuery: vi.fn(() => ({ hasNext: false, next: vi.fn().mockResolvedValue([]) })),
  createMutedUserListQuery: vi.fn(() => ({ hasNext: false, next: vi.fn().mockResolvedValue([]) })),
};

const sendbirdState = {
  state: {
    stores: {
      sdkStore: {
        sdk: {
          openChannel: {
            getChannel: vi.fn().mockResolvedValue(mockOpenChannel),
            addOpenChannelHandler: vi.fn(),
            removeOpenChannelHandler: vi.fn(),
          },
          currentUser: { userId: '1' },
        },
        initialized: true,
      },
      userStore: { user: { userId: '1' } },
    },
    config: {
      userId: '1',
      isOnline: true,
      logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() },
      pubSub: { subscribe: () => ({ remove: vi.fn() }) },
      imageCompression: {},
    },
  },
};

const callbacks = {
  onBeforeSendUserMessage: vi.fn((text) => ({ message: text })),
  onBeforeSendFileMessage: vi.fn((file) => ({ file })),
  onChatHeaderActionClick: vi.fn(),
  onBackClick: vi.fn(),
};

const renderContext = async () => {
  vi.mocked(useSendbird).mockReturnValue(sendbirdState as any);
  // Empty channelUrl short-circuits useSetChannel (no channel load) — the callbacks come straight
  // from props to the context value, so no channel is needed to verify their propagation.
  const wrapper = ({ children }) => (
    <OpenChannelProvider channelUrl="" {...callbacks}>
      {children}
    </OpenChannelProvider>
  );
  let result: any;
  await act(async () => {
    result = renderHook(() => useOpenChannelContext(), { wrapper }).result;
  });
  return result;
};

describe('OpenChannelProvider — callback propagation (integration)', () => {
  it('exposes every customer callback on the context by the same reference', async () => {
    const result = await renderContext();

    // `toBe` (reference identity) proves the provider forwarded the exact function, not a wrapper/clone.
    expect(result.current.onBeforeSendUserMessage).toBe(callbacks.onBeforeSendUserMessage);
    expect(result.current.onBeforeSendFileMessage).toBe(callbacks.onBeforeSendFileMessage);
    expect(result.current.onChatHeaderActionClick).toBe(callbacks.onChatHeaderActionClick);
    expect(result.current.onBackClick).toBe(callbacks.onBackClick);
  });
});
