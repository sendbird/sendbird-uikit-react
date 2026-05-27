/**
 * Phase 5.1.b — useUnreadSelector subscription hook.
 *
 * Covers:
 *   - Narrow-slice subscription (re-renders only when selector output
 *     changes per Object.is)
 *   - Provider boundary (throws outside provider)
 *   - Equality-fn override for derived shapes
 */
import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GroupChannelUnreadContext } from '../../GroupChannelUnreadContext';
import { useUnreadSelector } from '../useUnreadSelector';
import { createUnreadStore, dispatchToUnreadStore } from '../../../internal/unread/integration';
import {
  selectFirstUnreadMessageId,
  selectFirstUnreadCreatedAt,
  selectIsMessageUnread,
} from '../../../internal/unread/selectors';

function renderWithStore(node: React.ReactElement, store = createUnreadStore()) {
  const utils = render(
    <GroupChannelUnreadContext.Provider value={store}>
      {node}
    </GroupChannelUnreadContext.Provider>,
  );
  return { ...utils, store };
}

describe('Phase 5.1.b — useUnreadSelector', () => {
  it('returns the initial selector output on first render', () => {
    let observed: number | null | undefined;
    const Probe = () => {
      observed = useUnreadSelector(selectFirstUnreadMessageId);
      return null;
    };
    renderWithStore(<Probe />);
    expect(observed).toBeNull();
  });

  it('re-renders only when the selector output changes', () => {
    let renders = 0;
    let observed: number | null | undefined;
    const Probe = () => {
      renders++;
      observed = useUnreadSelector(selectFirstUnreadMessageId);
      return null;
    };
    const { store } = renderWithStore(<Probe />);

    expect(renders).toBe(1);
    expect(observed).toBeNull();

    // Dispatch that DOES change firstUnreadMessageId.
    act(() => {
      dispatchToUnreadStore(
        store,
        { type: 'MESSAGES_RECEIVED', messages: [{ messageId: 1, createdAt: 100 }], fromCurrentUser: false },
        { isAtBottom: false },
      );
    });
    expect(renders).toBe(2);
    expect(observed).toBe(1);

    // Dispatch that does NOT change firstUnreadMessageId (same anchor;
    // count grows but selector returns same primitive).
    act(() => {
      dispatchToUnreadStore(
        store,
        { type: 'MESSAGES_RECEIVED', messages: [{ messageId: 2, createdAt: 200 }], fromCurrentUser: false },
        { isAtBottom: false },
      );
    });
    // No re-render because selectFirstUnreadMessageId still returns 1.
    expect(renders).toBe(2);
    expect(observed).toBe(1);
  });

  it('throws when used outside a GroupChannelUnreadContext provider', () => {
    const Probe = () => {
      useUnreadSelector(selectFirstUnreadMessageId);
      return null;
    };
    // Suppress the React error boundary noise.
    const origError = console.error;
    console.error = jest.fn();
    try {
      expect(() => render(<Probe />)).toThrow(/useStoreSelector must be used within/);
    } finally {
      console.error = origError;
    }
  });

  it('selectIsMessageUnread tracks unread set membership', () => {
    let observedFor1: boolean | undefined;
    const Probe1 = () => {
      observedFor1 = useUnreadSelector((s) => selectIsMessageUnread(s, { messageId: 1 }));
      return null;
    };
    const { store } = renderWithStore(<Probe1 />);
    expect(observedFor1).toBe(false);

    act(() => {
      dispatchToUnreadStore(
        store,
        { type: 'MESSAGES_RECEIVED', messages: [{ messageId: 1, createdAt: 100 }], fromCurrentUser: false },
        { isAtBottom: false },
      );
    });
    expect(observedFor1).toBe(true);

    // A separate mount with a different messageId — NOT a rerender with
    // a new prop. Inline selectors that close over props rely on a fresh
    // mount because the selector swap intentionally reuses the memoized
    // snapshot when the raw store state has not changed (zustand idiom;
    // see useStoreSelector JSDoc).
    let observedFor99: boolean | undefined;
    const Probe99 = () => {
      observedFor99 = useUnreadSelector((s) => selectIsMessageUnread(s, { messageId: 99 }));
      return null;
    };
    render(
      <GroupChannelUnreadContext.Provider value={store}>
        <Probe99 />
      </GroupChannelUnreadContext.Provider>,
    );
    expect(observedFor99).toBe(false);
  });

  it('honors custom equalityFn — derived object selectors stay stable', () => {
    let renders = 0;
    const Probe = () => {
      renders++;
      // Selector synthesizes a new object each call; without the custom
      // equality, identity would diverge on every dispatch.
      useUnreadSelector(
        (s) => ({ anchor: selectFirstUnreadMessageId(s), at: selectFirstUnreadCreatedAt(s) }),
        (a, b) => a.anchor === b.anchor && a.at === b.at,
      );
      return null;
    };
    const { store } = renderWithStore(<Probe />);
    expect(renders).toBe(1);

    // Dispatch that changes nothing observable to this selector.
    act(() => {
      dispatchToUnreadStore(store, { type: 'USER_REACHED_BOTTOM', at: 500 });
    });
    // No re-render — selector output equal under the custom predicate.
    expect(renders).toBe(1);
  });
});
