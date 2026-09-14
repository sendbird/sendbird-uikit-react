import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { GroupChannelProvider, useGroupChannelContext } from '../GroupChannelProvider';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { makeGroupChannelSendbirdState } from '../../../../utils/testMocks/groupChannelSendbirdState';

// Verify that the customer's message callbacks passed to GroupChannelProvider reach the context
// state (prop -> store -> context) unchanged. Their INVOCATION during a send is covered by
// useMessageActions.spec.tsx; this proves the provider wiring does not drop or replace them on
// the way to the send path.
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({ __esModule: true, default: vi.fn() }));

const sendbirdState = makeGroupChannelSendbirdState();

// The full set of "before send / before update" hooks a customer can supply.
const callbacks = {
  onBeforeSendUserMessage: vi.fn((p) => p),
  onBeforeSendFileMessage: vi.fn((p) => p),
  onBeforeSendVoiceMessage: vi.fn((p) => p),
  onBeforeSendMultipleFilesMessage: vi.fn((p) => p),
  onBeforeUpdateUserMessage: vi.fn((p) => p),
};

const renderContext = async (props: Record<string, unknown> = callbacks) => {
  vi.mocked(useSendbird).mockReturnValue(sendbirdState as any);
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <GroupChannelProvider channelUrl="test-channel" {...props}>
      {children}
    </GroupChannelProvider>
  );
  let result: any;
  await act(async () => {
    result = renderHook(() => useGroupChannelContext(), { wrapper }).result;
  });
  return result;
};

describe('GroupChannelProvider — message callback propagation (integration)', () => {
  it('exposes every customer onBefore* callback on the context by the same reference', async () => {
    const result = await renderContext();

    // `toBe` (reference identity) proves the provider forwarded the exact function, not a wrapper/clone.
    expect(result.current.onBeforeSendUserMessage).toBe(callbacks.onBeforeSendUserMessage);
    expect(result.current.onBeforeSendFileMessage).toBe(callbacks.onBeforeSendFileMessage);
    expect(result.current.onBeforeSendVoiceMessage).toBe(callbacks.onBeforeSendVoiceMessage);
    expect(result.current.onBeforeSendMultipleFilesMessage).toBe(callbacks.onBeforeSendMultipleFilesMessage);
    expect(result.current.onBeforeUpdateUserMessage).toBe(callbacks.onBeforeUpdateUserMessage);
  });

  it('leaves every onBefore* callback undefined when the app supplies none', async () => {
    const result = await renderContext({});

    // The send path branches on these being absent (`onBeforeSendUserMessage ? ... : createParamsDefault()`),
    // so a UIKit-injected passthrough default would silently kill the default-params branch.
    expect(result.current.onBeforeSendUserMessage).toBeUndefined();
    expect(result.current.onBeforeSendFileMessage).toBeUndefined();
    expect(result.current.onBeforeSendVoiceMessage).toBeUndefined();
    expect(result.current.onBeforeSendMultipleFilesMessage).toBeUndefined();
    expect(result.current.onBeforeUpdateUserMessage).toBeUndefined();
  });
});
