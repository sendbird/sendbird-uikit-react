import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';

import { OpenChannelListProvider, useOpenChannelListContext } from '../OpenChannelListProvider';
import actionTypes from '../dux/actionTypes';
import { OpenChannelListFetchingStatus } from '../OpenChannelListInterfaces';

const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};
const mockChannels = [
  { url: 'open-channel-1', name: 'Open channel 1' },
  { url: 'open-channel-2', name: 'Open channel 2' },
];
const mockAddOpenChannelHandler = jest.fn();
const mockRemoveOpenChannelHandler = jest.fn();
const mockSubscribe = jest.fn(() => ({ remove: jest.fn() }));
const mockFetchNextChannels = jest.fn();
const mockRefreshOpenChannelList = jest.fn();

function mockUseSetupOpenChannelList(_params, { openChannelListDispatcher }) {
  React.useEffect(() => {
    openChannelListDispatcher({
      type: 'INIT_OPEN_CHANNEL_LIST_SUCCESS',
      payload: mockChannels,
    });
  }, [openChannelListDispatcher]);
}

jest.mock('@sendbird/chat/openChannel', () => ({
  OpenChannelHandler: jest.fn((handlers) => handlers),
}));

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: {
      stores: {
        sdkStore: {
          initialized: true,
          sdk: {
            openChannel: {
              addOpenChannelHandler: mockAddOpenChannelHandler,
              removeOpenChannelHandler: mockRemoveOpenChannelHandler,
            },
          },
        },
      },
      config: {
        logger: mockLogger,
        pubSub: { subscribe: mockSubscribe },
      },
    },
  })),
}));

jest.mock('../hooks/useSetupOpenChannelList', () => ({ __esModule: true, default: jest.fn(mockUseSetupOpenChannelList) }));
jest.mock('../hooks/useFetchNextCallback', () => ({ __esModule: true, default: jest.fn(() => mockFetchNextChannels) }));
jest.mock('../hooks/useRefreshOpenChannelList', () => ({ __esModule: true, default: jest.fn(() => mockRefreshOpenChannelList) }));

describe('OpenChannelListProvider', () => {
  const wrapper = ({ children }) => (
    <OpenChannelListProvider className="custom-class" onChannelSelected={jest.fn()}>
      {children}
    </OpenChannelListProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initialized channel list state and callbacks', async () => {
    const { result } = renderHook(() => useOpenChannelListContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.fetchingStatus).toBe(OpenChannelListFetchingStatus.DONE);
      expect(result.current.allChannels).toEqual(mockChannels);
    });

    expect(result.current.currentChannel).toBeNull();
    expect(result.current.fetchNextChannels).toBe(mockFetchNextChannels);
    expect(result.current.refreshOpenChannelList).toBe(mockRefreshOpenChannelList);
    expect(mockAddOpenChannelHandler).toHaveBeenCalledTimes(1);
  });

  it('updates provider state through the exposed dispatcher', async () => {
    const { result } = renderHook(() => useOpenChannelListContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.allChannels).toEqual(mockChannels);
    });

    act(() => {
      result.current.openChannelListDispatcher({
        type: actionTypes.SET_CURRENT_OPEN_CHANNEL,
        payload: mockChannels[1],
      });
    });

    expect(result.current.currentChannel).toBe(mockChannels[1]);

    act(() => {
      result.current.openChannelListDispatcher({
        type: actionTypes.RESET_OPEN_CHANNEL_LIST,
        payload: null,
      });
    });

    expect(result.current.allChannels).toEqual([]);
    expect(result.current.fetchingStatus).toBe(OpenChannelListFetchingStatus.EMPTY);
  });
});
