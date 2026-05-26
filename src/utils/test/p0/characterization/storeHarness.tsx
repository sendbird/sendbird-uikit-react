/**
 * Shared characterization fixture for Phase 0.
 *
 * Built on top of the production `createStore` (`src/utils/storeManager.ts`)
 * so equality-short-circuit semantics match real consumer behavior. Adds
 * test-only affordances:
 *
 *   - notify counter via subscribed listener (`notifyCount()`)
 *   - DOM helpers (`createScrollContainer`) that produce an element WITH a
 *     parentNode — required by `useGroupChannel.scrollToMessage`
 *     (`useGroupChannel.ts:111-116` reads element.parentNode)
 *   - jest-friendly `scrollPubSub` whose subscribe returns `{ remove }`
 *   - `makeSendbirdConfig()` factory so each spec gets a fresh
 *     `markAsReadScheduler` jest.fn
 *
 * Each spec must still declare its own `jest.mock('.../useSendbird', ...)`
 * because jest.mock is hoisted and cannot be parameterized through a helper.
 * Variable names referenced inside the factory must be `mock`-prefixed.
 *
 * This fixture lives outside `__tests__/` so jest's default testMatch does
 * not interpret it as a (failing) test suite.
 */
import * as React from 'react';
import { GroupChannelContext } from '../../../../modules/GroupChannel/context/GroupChannelProvider';
import { createStore, type Store } from '../../../storeManager';

export type CharacterizationStoreState = {
  currentChannel: any;
  fetchChannelError: any;
  quoteMessage: any;
  animatedMessageId: number | null;
  isScrollBottomReached: boolean;
  messages: any[];
  newMessageIds: number[];
  scrollRef: { current: HTMLDivElement | null };
  hasNext: () => boolean;
  resetWithStartingPoint: jest.Mock;
  resetNewMessages: jest.Mock;
  scrollPubSub: {
    publish: jest.Mock;
    subscribe: jest.Mock;
  };
  disableMarkAsRead: boolean;
  markAsUnread: jest.Mock;
  initialized: boolean;
  firstUnreadMessageId: number | null;
  unreadSinceDate: Date | null;
  nicknamesMap: Map<string, string>;
  readState: string | null;
  updateFileMessage: jest.Mock;
  resendMessage: jest.Mock;
  deleteMessage: jest.Mock;
  [k: string]: unknown;
};

export type CharacterizationStore = Store<CharacterizationStoreState> & {
  notifyCount: () => number;
};

function defaultState(): CharacterizationStoreState {
  return {
    currentChannel: null,
    fetchChannelError: null,
    quoteMessage: null,
    animatedMessageId: null,
    isScrollBottomReached: true,
    messages: [],
    newMessageIds: [],
    scrollRef: { current: null },
    hasNext: () => false,
    resetWithStartingPoint: jest.fn().mockResolvedValue(undefined),
    resetNewMessages: jest.fn(),
    scrollPubSub: {
      publish: jest.fn(),
      subscribe: jest.fn(() => ({ remove: jest.fn() })) as unknown as jest.Mock,
    },
    disableMarkAsRead: false,
    markAsUnread: jest.fn(),
    initialized: true,
    firstUnreadMessageId: null,
    unreadSinceDate: null,
    nicknamesMap: new Map(),
    readState: null,
    // Message-action surface fields. In production these come from coreTs
    // `useGroupChannelMessages` and are spread into the GroupChannel store.
    // Provided here as jest.fn() so `useMessageActions(state)` finds them
    // and the context-shape baseline records them as `function`.
    updateFileMessage: jest.fn(),
    resendMessage: jest.fn(),
    deleteMessage: jest.fn(),
  };
}

/**
 * Build a characterization store on top of the production `createStore`.
 * Equality short-circuit semantics from `hasStateChanged` are preserved.
 */
export function createCharacterizationStore(
  overrides: Partial<CharacterizationStoreState> = {},
): CharacterizationStore {
  const initial: CharacterizationStoreState = { ...defaultState(), ...overrides };
  const store = createStore<CharacterizationStoreState>(initial);
  let notifyCount = 0;
  store.subscribe(() => {
    notifyCount += 1;
  });
  return Object.assign(store, {
    notifyCount: () => notifyCount,
  }) as CharacterizationStore;
}

export function createWrapper(store: CharacterizationStore): React.FC<{ children: React.ReactNode }> {
  return ({ children }) => (
    <GroupChannelContext.Provider value={store as any}>{children}</GroupChannelContext.Provider>
  );
}

/**
 * Construct a scroll container that satisfies `useGroupChannel.scrollToMessage`'s
 * parentNode requirement at `useGroupChannel.ts:111-116`.
 *
 * Returns the inner element (use as `scrollRef.current`) and the parent
 * (already styled with `cursor`, attached to `document.body`).
 */
export function createScrollContainer(): {
  current: HTMLDivElement;
  parent: HTMLDivElement;
  cleanup: () => void;
} {
  const parent = document.createElement('div');
  const element = document.createElement('div');
  parent.appendChild(element);
  document.body.appendChild(parent);
  return {
    current: element,
    parent,
    cleanup: () => {
      if (parent.parentNode) parent.parentNode.removeChild(parent);
    },
  };
}

export function mockChannel(overrides: Partial<any> = {}) {
  return {
    url: 'test-channel',
    members: [{ userId: '1', nickname: 'user1' }],
    myMemberState: 'joined',
    addReaction: jest.fn().mockResolvedValue({}),
    deleteReaction: jest.fn().mockResolvedValue({}),
    serialize: function () { return JSON.stringify({ url: this.url }); },
    ...overrides,
  };
}

export function mockMessage(overrides: Partial<any> = {}) {
  return {
    messageId: 100,
    createdAt: 1000,
    sender: { userId: 'other' },
    message: 'hello',
    reactions: [],
    isUserMessage: () => true,
    isFileMessage: () => false,
    isAdminMessage: () => false,
    isMultipleFilesMessage: () => false,
    messageType: 'user',
    serialize: function () { return JSON.stringify({ messageId: this.messageId }); },
    ...overrides,
  };
}

/**
 * Build a fresh sendbird config object (each call returns a new
 * markAsReadScheduler jest.fn so specs don't bleed between describe blocks).
 */
export function makeSendbirdConfig(overrides: Record<string, unknown> = {}) {
  return {
    isOnline: true,
    logger: { warning: jest.fn(), error: jest.fn(), info: jest.fn() },
    markAsReadScheduler: { push: jest.fn() },
    groupChannel: {
      replyType: 'NONE',
      threadReplySelectType: 'PARENT',
      enableMarkAsUnread: false,
    },
    groupChannelSettings: { enableMessageSearch: true },
    pubSub: { subscribe: () => ({ remove: jest.fn() }) },
    ...overrides,
  };
}

/**
 * Legacy alias maintained for the four existing specs. New specs should call
 * `makeSendbirdConfig()` per test rather than spread this constant — sharing
 * the same `markAsReadScheduler.push` jest.fn across tests is fragile.
 *
 * @deprecated Use `makeSendbirdConfig()` factory instead.
 */
export const defaultSendbirdConfig = makeSendbirdConfig();

/**
 * Identity probe — renders a span whose `data-actions-rev` increments each
 * time `actions` reference changes. Used to detect memo dependency churn
 * regressions that would otherwise hide because no consumer reads `actions`.
 */
export function ActionsIdentityProbe(props: {
  actions: unknown;
  onChange: () => void;
}): React.ReactElement {
  const lastRef = React.useRef<unknown>(props.actions);
  if (lastRef.current !== props.actions) {
    lastRef.current = props.actions;
    props.onChange();
  }
  return <span data-testid="actions-identity-probe" />;
}
