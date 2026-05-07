import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import * as actionTypes from '../../dux/actionTypes';
import setupChannelList, { pubSubHandler, pubSubHandleRemover } from '../../utils';
import useActiveChannelUrl from '../hooks/useActiveChannelUrl';
import { useFetchChannelList } from '../hooks/useFetchChannelList';
import useHandleReconnectForChannelList from '../../../Channel/context/hooks/useHandleReconnectForChannelList';
import { ChannelListProvider, useChannelListContext } from '../ChannelListProvider';

let mockGroupChannelHandler: any;

jest.mock('@sendbird/chat/groupChannel', () => ({
  GroupChannelHandler: jest.fn().mockImplementation((handler) => {
    mockGroupChannelHandler = handler;
    return handler;
  }),
}));
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../../lib/UserProfileContext', () => ({
  UserProfileProvider: ({ children }: any) => <div data-testid="profile-provider">{children}</div>,
}));
jest.mock('../../utils', () => ({
  __esModule: true,
  default: jest.fn(),
  pubSubHandler: jest.fn(() => ({ remove: jest.fn() })),
  pubSubHandleRemover: jest.fn(),
}));
jest.mock('../hooks/useActiveChannelUrl', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../hooks/useFetchChannelList', () => ({
  useFetchChannelList: jest.fn(() => jest.fn()),
}));
jest.mock('../../../Channel/context/hooks/useHandleReconnectForChannelList', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
};

const channel = {
  url: 'channel-url',
  isGroupChannel: () => true,
  getTypingUsers: jest.fn(() => [{ userId: 'typing-user' }]),
};

const createSdk = (initialized = true) => ({
  appInfo: {
    premiumFeatureList: [],
  },
  currentUser: {
    userId: 'me',
  },
  groupChannel: {
    addGroupChannelHandler: jest.fn(),
    removeGroupChannelHandler: jest.fn(),
    getChannel: jest.fn().mockResolvedValue(channel),
    getChannelWithoutCache: jest.fn().mockResolvedValue({ ...channel, url: 'fresh-channel' }),
  },
  initialized,
});

const setSendbirdState = (initialized = true, sdk = createSdk(initialized)) => {
  (useSendbird as jest.Mock).mockReturnValue({
    state: {
      config: {
        pubSub: {},
        logger,
        userId: 'me',
        allowProfileEdit: true,
        groupChannelList: {
          enableTypingIndicator: true,
          enableMessageReceiptStatus: true,
        },
        markAsDeliveredScheduler: { push: jest.fn() },
        disableMarkAsDelivered: false,
        isOnline: true,
      },
      stores: {
        sdkStore: {
          initialized,
          sdk,
        },
      },
    },
  });
  return sdk;
};

const Consumer = ({ channelList = [channel] }: { channelList?: any[] }) => {
  const context = useChannelListContext();
  return (
    <div>
      <div data-testid="typing-count">{context.typingChannels.length}</div>
      <div data-testid="allow-profile">{String(context.allowProfileEdit)}</div>
      <div data-testid="typing-enabled">{String(context.isTypingIndicatorEnabled)}</div>
      <button
        type="button"
        data-testid="init"
        onClick={() => context.channelListDispatcher({
          type: actionTypes.INIT_CHANNELS_SUCCESS,
          payload: {
            channelList,
            disableAutoSelect: false,
          },
        } as any)}
      >
        init
      </button>
    </div>
  );
};

describe('ChannelListProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGroupChannelHandler = undefined;
  });

  it('provides context values, initializes handlers, and reacts to typing events', async () => {
    const sdk = setSendbirdState(true);
    const onChannelSelect = jest.fn();
    const sortChannelList = jest.fn((channels) => channels);

    const { unmount } = render(
      <ChannelListProvider
        className="custom-list"
        onChannelSelect={onChannelSelect}
        sortChannelList={sortChannelList}
        activeChannelUrl="channel-url"
      >
        <Consumer />
      </ChannelListProvider>,
    );

    expect(screen.getByTestId('profile-provider')).toBeInTheDocument();
    expect(screen.getByTestId('allow-profile')).toHaveTextContent('true');
    expect(screen.getByTestId('typing-enabled')).toHaveTextContent('true');
    expect(pubSubHandler).toHaveBeenCalled();
    expect(setupChannelList).toHaveBeenCalledWith(expect.objectContaining({
      sdk,
      disableAutoSelect: true,
      sortChannelList,
    }));
    expect(useActiveChannelUrl).toHaveBeenCalled();
    expect(useHandleReconnectForChannelList).toHaveBeenCalled();
    expect(useFetchChannelList).toHaveBeenCalledWith(
      expect.objectContaining({ disableMarkAsDelivered: true }),
      expect.any(Object),
    );

    fireEvent.click(screen.getByTestId('init'));
    await waitFor(() => {
      expect(onChannelSelect).toHaveBeenCalledWith(channel);
    });

    fireEvent.click(screen.getByTestId('init'));
    act(() => {
      mockGroupChannelHandler.onTypingStatusUpdated(channel);
    });
    await waitFor(() => {
      expect(screen.getByTestId('typing-count')).toHaveTextContent('1');
    });
    act(() => {
      mockGroupChannelHandler.onUnreadMemberStatusUpdated(channel);
      mockGroupChannelHandler.onUndeliveredMemberStatusUpdated(channel);
      mockGroupChannelHandler.onMessageUpdated(channel);
      mockGroupChannelHandler.onMentionReceived(channel);
    });
    expect(sdk.groupChannel.getChannelWithoutCache).toHaveBeenCalledWith('channel-url');

    unmount();
    expect(pubSubHandleRemover).toHaveBeenCalled();
    expect(sdk.groupChannel.removeGroupChannelHandler).toHaveBeenCalled();
  });

  it('resets the provider when the SDK is not initialized', () => {
    const sdk = setSendbirdState(false);

    render(
      <ChannelListProvider>
        <Consumer />
      </ChannelListProvider>,
    );

    expect(logger.info).toHaveBeenCalledWith('ChannelList: Removing channelHandlers');
    expect(sdk.groupChannel.removeGroupChannelHandler).toHaveBeenCalled();
  });
});
