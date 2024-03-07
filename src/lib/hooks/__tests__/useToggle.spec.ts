
import { act, renderHook } from '@testing-library/react';
import useToggle from '../useToggle';

describe('useToggle', () => {
  it('toggle()', async () => {
    const fn = jest.fn((toggled: boolean) => {
      expect(toggled).toBeTruthy();
    });
    const { result } = renderHook(() => useToggle(fn));
    const toggle = result.current;
    
    act(() => { toggle(); });

    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 600);
    });
    expect(fn).toBeCalledTimes(1);
  });
  it('toggle() with argument', async () => {
    const fn = jest.fn((toggled: boolean, value: number) => {
      expect(toggled).toBeTruthy();
      expect(value).toBe(14);
    });
    const { result } = renderHook(() => useToggle(fn));
    const toggle = result.current;
    
    act(() => { toggle(14); });

    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 600);
    });
    expect(fn).toBeCalledTimes(1);
  });
  it('toggle() even times', async () => {
    const fn = jest.fn();
    const { result } = renderHook(() => useToggle(fn));
    const toggle = result.current;
    
    act(() => { toggle(); });
    act(() => { toggle(); });

    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 600);
    });
    expect(fn).not.toBeCalled();
  });
  it('toggle() odd times', async () => {
    const fn = jest.fn((toggled: boolean) => {
      expect(toggled).toBeTruthy();
    });
    const { result } = renderHook(() => useToggle(fn));
    const toggle = result.current;
    
    act(() => { toggle(); });
    act(() => { toggle(); });
    act(() => { toggle(); });

    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 600);
    });
    expect(fn).toBeCalledTimes(1);
  });
});