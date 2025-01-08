import { renderHook, waitFor } from '@testing-library/react';
import useDidMountEffect from '../useDidMountEffect';

describe('useDidMountEffect', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('ignore callback if didMount was false', () => {
    const mockCallback = jest.fn();
    renderHook(() => useDidMountEffect(mockCallback, []));

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('call callback if didMount was true', async () => {
    const mockCallback = jest.fn();
    const mockDeps = [1];
    renderHook(() => useDidMountEffect(mockCallback, mockDeps));

    mockDeps[0] = 2;

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
