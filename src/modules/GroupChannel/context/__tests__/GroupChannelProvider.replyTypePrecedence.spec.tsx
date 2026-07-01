import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { GroupChannelProvider, useGroupChannelContext } from '../GroupChannelProvider';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

// Verify the precedence WIRING (module prop over dashboard config), not the pure resolver
// (already covered by resolvedReplyType.spec.ts). Mock useSendbird to inject the dashboard
// config.groupChannel.replyType; render the real GroupChannelProvider; read the resolved value.
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({ __esModule: true, default: vi.fn() }));

const mockLogger = { warning: vi.fn(), info: vi.fn(), error: vi.fn() };
const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
  serialize: () => JSON.stringify({}),
};
const mockMessageCollection = {
  dispose: vi.fn(),
  setMessageCollectionHandler: vi.fn(),
  initialize: vi.fn().mockResolvedValue(null),
  loadPrevious: vi.fn(),
  loadNext: vi.fn(),
  messages: [],
};

const makeSendbirdState = (dashboardReplyType: string) => ({
  state: {
    stores: {
      sdkStore: {
        sdk: {
          groupChannel: {
            getChannel: vi.fn().mockResolvedValue(mockChannel),
            addGroupChannelHandler: vi.fn(),
            removeGroupChannelHandler: vi.fn(),
          },
          createMessageCollection: vi.fn().mockReturnValue(mockMessageCollection),
        },
        initialized: true,
      },
    },
    config: {
      logger: mockLogger,
      markAsReadScheduler: { push: vi.fn() },
      groupChannel: { replyType: dashboardReplyType, threadReplySelectType: 'PARENT' },
      groupChannelSettings: { enableMessageSearch: true },
      isOnline: true,
      pubSub: { subscribe: () => ({ remove: vi.fn() }) },
    },
  },
});

const renderResolvedReplyType = async (dashboardReplyType: string, moduleReplyType?: string) => {
  vi.mocked(useSendbird).mockReturnValue(makeSendbirdState(dashboardReplyType) as any);
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <GroupChannelProvider channelUrl="test-channel" replyType={moduleReplyType as any}>
      {children}
    </GroupChannelProvider>
  );
  let result: any;
  await act(async () => {
    result = renderHook(() => useGroupChannelContext(), { wrapper }).result;
  });
  return result.current.replyType;
};

describe('GroupChannelProvider — replyType precedence (module prop over dashboard config)', () => {
  it('uses the module-level replyType prop when provided (wins over dashboard config)', async () => {
    const replyType = await renderResolvedReplyType('NONE', 'QUOTE_REPLY');
    expect(replyType).toBe('QUOTE_REPLY');
  });

  it('falls back to the dashboard config replyType when no module prop is given', async () => {
    const replyType = await renderResolvedReplyType('THREAD');
    expect(replyType).toBe('THREAD');
  });
});
