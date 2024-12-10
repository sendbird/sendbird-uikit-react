import { renderHook } from '@testing-library/react-hooks';
import { useThrottleCallback } from '../useThrottleCallback';

describe('useThrottleCallback', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handle throttle callback correctly when leading is true', async () => {
    const mockCallback = jest.fn();

    const { result: { current: throttleCallback } } = renderHook(() => useThrottleCallback(mockCallback, 1000, { leading: true }));

    throttleCallback();
    throttleCallback();
    throttleCallback();
    throttleCallback();
    throttleCallback();

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockCallback).toHaveBeenCalledTimes(1);

    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(mockCallback).toHaveBeenCalledTimes(1);

  });

  it('handle throttle callback correctly when trailing is true', async () => {
    const mockCallback = jest.fn();

    const { result: { current: throttleCallback } } = renderHook(() => useThrottleCallback(mockCallback, 1000, { trailing: true }));

    throttleCallback();
    throttleCallback();
    throttleCallback();
    throttleCallback();
    throttleCallback();

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockCallback).toHaveBeenCalledTimes(0);

    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(mockCallback).toHaveBeenCalledTimes(1);

    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

});
