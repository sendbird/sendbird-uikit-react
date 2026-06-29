import { renderHook } from '@testing-library/react';
import type { Mock } from 'vitest';
import { useScrollBehavior } from '../useScrollBehavior';
import { useChannelContext } from '../../../../context/ChannelProvider';
import type { ChannelProviderInterface } from '../../../../context/ChannelProvider';

vi.mock('../../../../context/ChannelProvider', () => ({
  useChannelContext: vi.fn(),
}));

describe('useScrollBehavior', () => {
  it('should set scroll behavior on scrollRef', () => {
    const scrollRefMock = { current: { style: { scrollBehavior: 'auto' } } };
    const scrollBehaviorMock = 'smooth';

    (useChannelContext as Mock<() => ChannelProviderInterface>).mockReturnValue({
      scrollRef: scrollRefMock,
      scrollBehavior: scrollBehaviorMock,
    } as unknown as ChannelProviderInterface);

    renderHook(() => useScrollBehavior());

    expect(scrollRefMock.current.style.scrollBehavior).toBe(scrollBehaviorMock);
  });

  it('should set the scrollBehavior to `auto` by default if scrollBehavior prop is not set', () => {
    const scrollRefMock = { current: { style: {} } };

    (useChannelContext as Mock<() => ChannelProviderInterface>).mockReturnValue({
      scrollRef: scrollRefMock,
    } as unknown as ChannelProviderInterface);

    renderHook(() => useScrollBehavior());

    expect((scrollRefMock.current.style as unknown as { scrollBehavior: string }).scrollBehavior).toBe('auto');
  });
});
