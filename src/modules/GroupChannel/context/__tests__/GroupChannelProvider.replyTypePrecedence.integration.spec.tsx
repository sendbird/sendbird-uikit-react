import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { GroupChannelProvider, useGroupChannelContext } from '../GroupChannelProvider';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { makeGroupChannelSendbirdState } from '../../../../utils/testMocks/groupChannelSendbirdState';

// Verify the precedence WIRING (module prop over dashboard config), not the pure resolver
// (already covered by resolvedReplyType.spec.ts). Mock useSendbird to inject the dashboard
// config.groupChannel.replyType; render the real GroupChannelProvider; read the resolved value.
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({ __esModule: true, default: vi.fn() }));

const renderResolvedReplyType = async (dashboardReplyType: string, moduleReplyType?: string) => {
  vi.mocked(useSendbird).mockReturnValue(makeGroupChannelSendbirdState({ replyType: dashboardReplyType }) as any);
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
