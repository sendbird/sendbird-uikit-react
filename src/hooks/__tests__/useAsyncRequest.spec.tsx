import { act, renderHook } from '@testing-library/react';
import { useAsyncRequest } from '../useAsyncRequest';

describe('useAsyncRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handle request with no response correctly', async () => {
    const mockPromise = Promise.resolve();
    const mockRequest = vi.fn().mockReturnValue(mockPromise);

    const { result } = renderHook(() => useAsyncRequest(mockRequest));

    await act(async () => {
      await mockPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('handle request with response correctly', async () => {
    const mockResponse = { code: 'ok' };
    const mockPromise = Promise.resolve(mockResponse);
    const mockRequest = vi.fn().mockReturnValue(mockPromise);

    const { result } = renderHook(() => useAsyncRequest(mockRequest));

    await act(async () => {
      await mockPromise;
    });

    expect(result.current.response).toBe(mockResponse);
    expect(result.current.loading).toBe(false);
  });

  it('cancel request correctly', async () => {
    const mockCancel = vi.fn();
    const mockRequest = { cancel: mockCancel };

    const { unmount } = renderHook(() => useAsyncRequest(mockRequest as unknown as Parameters<typeof useAsyncRequest>[0]));

    unmount();

    expect(mockCancel).toBeCalled();
  });

});
