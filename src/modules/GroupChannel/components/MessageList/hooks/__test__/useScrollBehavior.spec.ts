import { renderHook } from '@testing-library/react';
import { useScrollBehavior } from '../useScrollBehavior';
import { useGroupChannelContext } from '../../../../context/ChannelProvider';

jest.mock('../../../../context/ChannelProvider', () => ({
  useGroupChannelContext: jest.fn(),
}));

describe('useScrollBehavior', () => {
  it('should set scroll behavior on scrollRef', () => {
    const scrollRefMock = { current: { style: { scrollBehavior: 'auto' } } };
    const scrollBehaviorMock = 'smooth';

    useGroupChannelContext.mockReturnValue({
      scrollRef: scrollRefMock,
      scrollBehavior: scrollBehaviorMock,
    });

    renderHook(() => useScrollBehavior());

    expect(scrollRefMock.current.style.scrollBehavior).toBe(scrollBehaviorMock);
  });

  it('should set the scrollBehavior to `auto` by default if scrollBehavior prop is not set', () => {
    const scrollRefMock = { current: { style: { } } };

    useGroupChannelContext.mockReturnValue({
      scrollRef: scrollRefMock,
    });

    renderHook(() => useScrollBehavior());

    expect(scrollRefMock.current.style.scrollBehavior).toBe('auto');
  });
});
