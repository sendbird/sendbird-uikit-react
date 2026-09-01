import React from 'react';
import { renderHook } from '@testing-library/react';
import { MessageProvider, useMessageContext } from '../MessageProvider';

// The Message module's public contract: MessageProvider exposes the given message + isByMe to
// consumers via useMessageContext, unchanged.
describe('MessageProvider — context propagation (integration)', () => {
  it('exposes the provided message and isByMe on the context', () => {
    const message = { messageId: 7 } as any;
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <MessageProvider message={message} isByMe>{children}</MessageProvider>
    );

    const { result } = renderHook(() => useMessageContext(), { wrapper });

    expect(result.current.message).toBe(message);
    expect(result.current.isByMe).toBe(true);
  });

  it('defaults isByMe to false when not provided', () => {
    const message = { messageId: 8 } as any;
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <MessageProvider message={message}>{children}</MessageProvider>
    );

    const { result } = renderHook(() => useMessageContext(), { wrapper });

    expect(result.current.message).toBe(message);
    expect(result.current.isByMe).toBe(false);
  });
});
