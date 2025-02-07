import { renderHook, act } from '@testing-library/react';
import useSearchStringEffect from '../hooks/useSearchStringEffect';
import useMessageSearch from '../hooks/useMessageSearch';

jest.mock('../hooks/useMessageSearch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.useFakeTimers();

describe('useSearchStringEffect', () => {
  const mockResetSearchString = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useMessageSearch as jest.Mock).mockReturnValue({
      actions: {
        resetSearchString: mockResetSearchString,
      },
    });
  });

  it('should set request string after debounce when search string is provided', async () => {
    const { result } = renderHook(() => useSearchStringEffect({ searchString: 'test query' }),
    );

    // Initial state should be empty
    expect(result.current).toBe('');

    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('test query');
  });

  it('should reset search string when empty string is provided', async () => {
    const { result } = renderHook(() => useSearchStringEffect({ searchString: '' }),
    );

    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('');
    expect(mockResetSearchString).toHaveBeenCalled();
  });

  it('should handle undefined search string', async () => {
    const { result } = renderHook(() => useSearchStringEffect({ searchString: undefined }),
    );

    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('');
    expect(mockResetSearchString).toHaveBeenCalled();
  });

  it('should clear previous timer when search string changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ searchString }) => useSearchStringEffect({ searchString }),
      { initialProps: { searchString: 'initial' } },
    );

    // Start first timer
    act(() => {
      jest.advanceTimersByTime(200); // Advance less than debounce time
    });

    // Change search string before first timer completes
    rerender({ searchString: 'updated' });

    // Advance timer to complete first debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Result should not be 'initial'
    expect(result.current).not.toBe('initial');

    // Complete second debounce
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Result should be 'updated'
    expect(result.current).toBe('updated');
  });

  it('should clean up timer on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useSearchStringEffect({ searchString: 'test' }),
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should not trigger unnecessary updates when search string remains the same', () => {
    const { result, rerender } = renderHook(
      ({ searchString }) => useSearchStringEffect({ searchString }),
      { initialProps: { searchString: 'test' } },
    );

    // Complete first debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    const firstResult = result.current;

    // Rerender with same search string
    rerender({ searchString: 'test' });

    // Complete second debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe(firstResult);
  });

  it('should handle multiple search string changes within debounce period', () => {
    const { result, rerender } = renderHook(
      ({ searchString }) => useSearchStringEffect({ searchString }),
      { initialProps: { searchString: 'first' } },
    );

    // Change search string multiple times rapidly
    rerender({ searchString: 'second' });
    rerender({ searchString: 'third' });
    rerender({ searchString: 'final' });

    // Advance timer to complete debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should only reflect the final value
    expect(result.current).toBe('final');
  });

  it('should maintain empty state when switching from empty to undefined', () => {
    const { result, rerender } = renderHook(
      ({ searchString }) => useSearchStringEffect({ searchString }),
      { initialProps: { searchString: '' } },
    );

    // Complete first debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('');
    expect(mockResetSearchString).toHaveBeenCalledTimes(1);

    // Switch to undefined
    rerender({ searchString: undefined });

    // Complete second debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('');
    expect(mockResetSearchString).toHaveBeenCalledTimes(2);
  });
});
