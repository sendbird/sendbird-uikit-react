import React from 'react';
import { act, render } from '@testing-library/react';

import { GroupChannelListProvider } from '../GroupChannelListProvider';
import type { ChannelListQueryParamsType } from '../GroupChannelListProvider';

const { refreshMock } = vi.hoisted(() => ({ refreshMock: vi.fn() }));

const mockState = {
  stores: {
    sdkStore: {
      sdk: {
        currentUser: {
          userId: 'test-user-id',
        },
      },
      initialized: true,
    },
  },
  config: {
    logger: console,
    groupChannelList: {
    },
  },
};
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', async () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
  useSendbird: vi.fn(() => ({ state: mockState })),
}));

vi.mock('@sendbird/uikit-tools', async () => ({
  ...await vi.importActual('@sendbird/uikit-tools'),
  useGroupChannelList: vi.fn(() => ({
    refreshing: false,
    initialized: true,
    groupChannels: [],
    refresh: refreshMock,
    loadMore: vi.fn(),
  })),
}));

/**
 * Regression tests for CLNP-8827.
 *
 * `useGroupChannelList` already creates the initial GroupChannelCollection using
 * `channelListQueryParams`, so refreshing on mount only discarded that collection
 * mid-flight. The superseded collection then resolved and committed the new,
 * still-empty collection's channels, briefly rendering the empty-list placeholder.
 *
 * The refresh must therefore fire only when `channelListQueryParams` actually change.
 */
describe('GroupChannelListProvider - channelListQueryParams', () => {
  const Subject = ({ channelListQueryParams }: { channelListQueryParams?: ChannelListQueryParamsType }) => (
    <GroupChannelListProvider
      onChannelSelect={vi.fn()}
      onChannelCreated={vi.fn()}
      channelListQueryParams={channelListQueryParams}
    />
  );

  // Let every pending effect settle so a late refresh cannot slip past the assertion.
  const flushEffects = () => act(async () => {});

  beforeEach(() => {
    refreshMock.mockClear();
  });

  it('does not refresh on mount', async () => {
    render(<Subject channelListQueryParams={{ includeEmpty: true } as ChannelListQueryParamsType} />);
    await flushEffects();

    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('does not refresh on mount without channelListQueryParams', async () => {
    render(<Subject />);
    await flushEffects();

    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('does not refresh on mount under StrictMode', async () => {
    // StrictMode double-invokes effects (setup -> cleanup -> setup) on the same
    // instance. A ref-based mount guard would let the second setup through and
    // reintroduce the duplicate initialization in development builds.
    render(
      <React.StrictMode>
        <Subject channelListQueryParams={{ includeEmpty: true } as ChannelListQueryParamsType} />
      </React.StrictMode>,
    );
    await flushEffects();

    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('refreshes when channelListQueryParams change', async () => {
    const { rerender } = render(
      <Subject channelListQueryParams={{ includeEmpty: true } as ChannelListQueryParamsType} />,
    );
    await flushEffects();
    expect(refreshMock).not.toHaveBeenCalled();

    rerender(<Subject channelListQueryParams={{ includeEmpty: false } as ChannelListQueryParamsType} />);
    await flushEffects();

    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it('does not refresh when channelListQueryParams keep the same value', async () => {
    const { rerender } = render(
      <Subject channelListQueryParams={{ includeEmpty: true } as ChannelListQueryParamsType} />,
    );
    await flushEffects();

    // A new object with identical contents - the serialized dependency must not change.
    rerender(<Subject channelListQueryParams={{ includeEmpty: true } as ChannelListQueryParamsType} />);
    await flushEffects();

    expect(refreshMock).not.toHaveBeenCalled();
  });
});
