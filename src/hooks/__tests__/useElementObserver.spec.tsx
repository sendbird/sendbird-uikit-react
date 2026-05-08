import { act, renderHook, waitFor } from '@testing-library/react';
import useElementObserver from '../useElementObserver';

describe('useElementObserver', () => {
  it('detects existing, added, and removed matching elements', async () => {
    const target = document.createElement('div');
    const existing = document.createElement('span');
    existing.className = 'observed';
    target.appendChild(existing);

    const { result, unmount } = renderHook(() => useElementObserver('.observed', target));

    expect(result.current).toBe(true);

    act(() => {
      target.removeChild(existing);
    });
    await waitFor(() => expect(result.current).toBe(false));

    const added = document.createElement('span');
    added.className = 'observed';
    act(() => {
      target.appendChild(added);
    });
    await waitFor(() => expect(result.current).toBe(true));

    unmount();
  });

  it('observes multiple targets and ignores non-element mutations', async () => {
    const firstTarget = document.createElement('div');
    const secondTarget = document.createElement('div');

    const { result } = renderHook(() => useElementObserver('.observed', [firstTarget, secondTarget]));

    expect(result.current).toBe(false);

    act(() => {
      firstTarget.appendChild(document.createTextNode('text'));
    });
    await Promise.resolve();
    expect(result.current).toBe(false);

    const added = document.createElement('span');
    added.className = 'observed';
    act(() => {
      secondTarget.appendChild(added);
    });
    await waitFor(() => expect(result.current).toBe(true));
  });

  it('handles a missing target element', () => {
    const { result } = renderHook(() => useElementObserver('.observed', null));

    expect(result.current).toBe(false);
  });
});
