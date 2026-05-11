import { act, renderHook, waitFor } from '@testing-library/react';

import OpenChannelListActionTypes from '../../dux/actionTypes';
import createChannelListQuery from '../createChannelListQuery';
import useFetchNextCallback from '../useFetchNextCallback';
import useRefreshOpenChannelList from '../useRefreshOpenChannelList';
import useSetupOpenChannelList from '../useSetupOpenChannelList';

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

const createQuery = (overrides = {}) => ({
  hasNext: true,
  next: jest.fn().mockResolvedValue([{ url: 'open-channel-1' }]),
  ...overrides,
});

const createSdk = (query = createQuery()) => ({
  openChannel: {
    createOpenChannelListQuery: jest.fn(() => query),
  },
});

describe('OpenChannelList context hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates and stores an open channel list query with defaults and overrides', () => {
    const query = createQuery();
    const sdk = createSdk(query);
    const dispatch = jest.fn();

    const result = createChannelListQuery({
      sdk: sdk as any,
      logger: logger as any,
      openChannelListDispatcher: dispatch,
      openChannelListQuery: { limit: 5, includeFrozen: false, nameKeyword: 'team' },
      logMessage: 'created query',
    });

    expect(result).toBe(query);
    expect(sdk.openChannel.createOpenChannelListQuery).toHaveBeenCalledWith({
      limit: 5,
      includeFrozen: false,
      nameKeyword: 'team',
    });
    expect(logger.info).toHaveBeenCalledWith('created query', query);
    expect(dispatch).toHaveBeenCalledWith({
      type: OpenChannelListActionTypes.UPDATE_OPEN_CHANNEL_LIST_QUERY,
      payload: query,
    });
  });

  it('refreshes the list and dispatches success', async () => {
    const channels = [{ url: 'open-channel-1' }, { url: 'open-channel-2' }];
    const query = createQuery({ next: jest.fn().mockResolvedValue(channels) });
    const dispatch = jest.fn();

    const { result } = renderHook(() => useRefreshOpenChannelList({
      sdk: createSdk(query) as any,
      sdkInitialized: true,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));

    act(() => {
      result.current();
    });

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_SUCCESS,
        payload: channels,
      });
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_START,
      payload: null,
    });
  });

  it('handles refresh reset, missing SDK APIs, exhausted queries, and failures', async () => {
    const dispatch = jest.fn();

    const resetHook = renderHook(() => useRefreshOpenChannelList({
      sdk: null as any,
      sdkInitialized: false,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));
    act(() => resetHook.result.current());
    expect(dispatch).toHaveBeenCalledWith({
      type: OpenChannelListActionTypes.RESET_OPEN_CHANNEL_LIST,
      payload: null,
    });

    const missingOpenChannel = renderHook(() => useRefreshOpenChannelList({
      sdk: {} as any,
      sdkInitialized: true,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));
    act(() => missingOpenChannel.result.current());
    expect(logger.warning).toHaveBeenCalledWith(
      'OpenChannelList|useRefreshOpenChannelList: openChannel is not included in the Chat SDK',
      {},
    );

    const missingCreateQuery = renderHook(() => useRefreshOpenChannelList({
      sdk: { openChannel: {} } as any,
      sdkInitialized: true,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));
    act(() => missingCreateQuery.result.current());
    expect(logger.warning).toHaveBeenCalledWith(
      'OpenChannelList|useRefreshOpenChannelList: createOpenChannelListQuery is not included in the openChannel',
      {},
    );

    const exhaustedQuery = createQuery({ hasNext: false });
    const exhausted = renderHook(() => useRefreshOpenChannelList({
      sdk: createSdk(exhaustedQuery) as any,
      sdkInitialized: true,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));
    act(() => exhausted.result.current());
    expect(logger.info).toHaveBeenCalledWith('OpenChannelList|useRefreshOpenChannelList: There is no more channels');

    const error = new Error('fetch failed');
    const failingQuery = createQuery({ next: jest.fn().mockRejectedValue(error) });
    const failing = renderHook(() => useRefreshOpenChannelList({
      sdk: createSdk(failingQuery) as any,
      sdkInitialized: true,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));
    act(() => failing.result.current());

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_FAILURE,
        payload: null,
      });
    });
    expect(logger.error).toHaveBeenCalledWith('OpenChannelList|useRefreshOpenChannelList: Failed fetching channels', error);
  });

  it('fetches next open channels and reports success or failure through the callback', async () => {
    const channels = [{ url: 'next-open-channel' }];
    const query = createQuery({ next: jest.fn().mockResolvedValue(channels) });
    const dispatch = jest.fn();
    const callback = jest.fn();

    const { result } = renderHook(() => useFetchNextCallback({
      sdkInitialized: true,
      openChannelListQuery: query as any,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));

    act(() => {
      result.current(callback);
    });

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(channels, undefined);
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: OpenChannelListActionTypes.FETCH_OPEN_CHANNEL_LIST_SUCCESS,
      payload: channels,
    });

    const error = new Error('next failed');
    const failingQuery = createQuery({ next: jest.fn().mockRejectedValue(error) });
    const failing = renderHook(() => useFetchNextCallback({
      sdkInitialized: true,
      openChannelListQuery: failingQuery as any,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));

    act(() => {
      failing.result.current(callback);
    });

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(undefined, error);
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: OpenChannelListActionTypes.FETCH_OPEN_CHANNEL_LIST_FAILURE,
      payload: null,
    });
  });

  it('does not fetch next channels when SDK is unavailable or query has no next page', () => {
    const dispatch = jest.fn();
    const callback = jest.fn();
    const query = createQuery({ hasNext: false });

    const { result, rerender } = renderHook(
      ({ sdkInitialized }) => useFetchNextCallback({
        sdkInitialized,
        openChannelListQuery: query as any,
      }, {
        logger: logger as any,
        openChannelListDispatcher: dispatch,
      }),
      { initialProps: { sdkInitialized: false } },
    );

    act(() => result.current(callback));
    expect(query.next).not.toHaveBeenCalled();

    rerender({ sdkInitialized: true });
    act(() => result.current(callback));
    expect(query.next).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('OpenChannelList|useFetchNextCallback : There is no more channels');
  });

  it('sets up the initial open channel list and dispatches success', async () => {
    const channels = [{ url: 'initial-open-channel' }];
    const query = createQuery({ next: jest.fn().mockResolvedValue(channels) });
    const dispatch = jest.fn();

    renderHook(() => useSetupOpenChannelList({
      sdk: createSdk(query) as any,
      sdkInitialized: true,
      openChannelListQuery: { limit: 7 },
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));

    expect(dispatch).toHaveBeenCalledWith({
      type: OpenChannelListActionTypes.UPDATE_OPEN_CHANNEL_LIST_QUERY,
      payload: query,
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_START,
      payload: null,
    });

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_SUCCESS,
        payload: channels,
      });
    });
  });

  it('handles setup reset, unavailable SDK modules, exhausted queries, and failures', async () => {
    const dispatch = jest.fn();

    renderHook(() => useSetupOpenChannelList({
      sdk: null as any,
      sdkInitialized: false,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));
    expect(dispatch).toHaveBeenCalledWith({
      type: OpenChannelListActionTypes.RESET_OPEN_CHANNEL_LIST,
      payload: null,
    });

    renderHook(() => useSetupOpenChannelList({
      sdk: {} as any,
      sdkInitialized: true,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));
    expect(logger.warning).toHaveBeenCalledWith(
      'OpenChannelList|useSetupOpenChannelList: openChannel is not included in the Chat SDK',
      {},
    );

    const exhaustedQuery = createQuery({ hasNext: false });
    renderHook(() => useSetupOpenChannelList({
      sdk: createSdk(exhaustedQuery) as any,
      sdkInitialized: true,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));
    expect(logger.info).toHaveBeenCalledWith('OpenChannelList|useSetupOpenChannelList: There is no more channels');

    const error = new Error('setup failed');
    const failingQuery = createQuery({ next: jest.fn().mockRejectedValue(error) });
    renderHook(() => useSetupOpenChannelList({
      sdk: createSdk(failingQuery) as any,
      sdkInitialized: true,
    }, {
      logger: logger as any,
      openChannelListDispatcher: dispatch,
    }));

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_FAILURE,
        payload: null,
      });
    });
    expect(logger.error).toHaveBeenCalledWith('OpenChannelList|useSetupOpenChannelList: Failed fetching channels', error);
  });
});
