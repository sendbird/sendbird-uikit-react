import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { act, render, screen } from '@testing-library/react';

import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import { GroupChannelListProvider } from '../../../context/GroupChannelListProvider';
import GroupChannelListUI from '../index';

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

const createDeferred = <T, >(): Deferred<T> => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
};

const createControlledCollection = () => {
  const loadMoreDeferred = createDeferred<GroupChannel[]>();
  const collection = {
    channels: [] as GroupChannel[],
    hasMore: true,
    loadMore: vi.fn(() => loadMoreDeferred.promise),
    dispose: vi.fn(),
    setGroupChannelCollectionHandler: vi.fn(),
    resolveLoadMore(channels: GroupChannel[]) {
      collection.channels = channels;
      loadMoreDeferred.resolve(channels);
    },
  };

  return collection;
};

const logger = {
  debug: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
};

const mockState = {
  stores: {
    sdkStore: {
      sdk: undefined as any,
      initialized: true,
      error: null,
    },
  },
  config: {
    logger,
    isOnline: true,
    disableMarkAsDelivered: true,
    groupChannelList: {},
  },
};

vi.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
  useSendbird: vi.fn(() => ({ state: mockState })),
}));

const stringSet = {
  PLACE_HOLDER__NO_CHANNEL: 'No channels',
};

describe('GroupChannelListUI empty placeholder integration', () => {
  it('keeps the empty placeholder hidden until the initial collection has loaded', async () => {
    const collectionA = createControlledCollection();
    const collectionB = createControlledCollection();
    const createGroupChannelCollection = vi.fn()
      .mockReturnValueOnce(collectionA)
      .mockReturnValueOnce(collectionB);

    mockState.stores.sdkStore.sdk = {
      currentUser: { userId: 'test-user-id' },
      appInfo: { premiumFeatureList: [] },
      connectionState: 'OPEN',
      isCacheEnabled: false,
      reconnect: vi.fn(),
      addConnectionHandler: vi.fn(),
      removeConnectionHandler: vi.fn(),
      groupChannel: {
        createGroupChannelCollection,
        addGroupChannelHandler: vi.fn(),
        removeGroupChannelHandler: vi.fn(),
      },
    } as any;

    const channel = {
      url: 'loaded-channel-url',
      name: 'Loaded channel',
      isGroupChannel: () => true,
      serialize: () => ({ url: 'loaded-channel-url' }),
    } as unknown as GroupChannel;

    const { container } = render(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <GroupChannelListProvider
          disableAutoSelect
          onChannelSelect={vi.fn()}
          onChannelCreated={vi.fn()}
        >
          <GroupChannelListUI
            renderHeader={() => <div>Channels</div>}
            renderChannelPreview={({ channel: renderedChannel }) => <div>{renderedChannel.name}</div>}
          />
        </GroupChannelListProvider>
      </LocalizationContext.Provider>,
    );

    expect(screen.queryByText(stringSet.PLACE_HOLDER__NO_CHANNEL)).not.toBeInTheDocument();
    expect(container.querySelector('.sendbird-loader')).toBeInTheDocument();

    await act(async () => {
      collectionA.resolveLoadMore([channel]);
      await collectionA.loadMore.mock.results[0].value;
    });

    expect(screen.queryByText(stringSet.PLACE_HOLDER__NO_CHANNEL)).not.toBeInTheDocument();
    expect(screen.getByText(channel.name)).toBeInTheDocument();
  });
});
