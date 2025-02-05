import { renderHook } from '@testing-library/react';
import { useAsyncRequest } from '../useAsyncRequest';

describe('useAsyncRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handle request with no response correctly', async () => {
    const mockPromise = Promise.resolve();
    const mockRequest = jest.fn().mockReturnValue(mockPromise);

    const { result } = renderHook(() => useAsyncRequest(mockRequest));

    await mockPromise;

    expect(result.current.loading).toBe(false);
  });

  it('handle request with response correctly', async () => {
    const mockResponse = { code: 'ok' };
    const mockPromise = Promise.resolve(mockResponse);
    const mockRequest = jest.fn().mockReturnValue(mockPromise);

    const { result } = renderHook(() => useAsyncRequest(mockRequest));

    await mockPromise;

    expect(result.current.response).toBe(mockResponse);
    expect(result.current.loading).toBe(false);
  });

  it('cancel request correctly', async () => {
    const mockCancel = jest.fn();
    const mockRequest = { cancel: mockCancel };

    const { unmount } = renderHook(() => useAsyncRequest(mockRequest));

    unmount();

    expect(mockCancel).toBeCalled();
  });

});
