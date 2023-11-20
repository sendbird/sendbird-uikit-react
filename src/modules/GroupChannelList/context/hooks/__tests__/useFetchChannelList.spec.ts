import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react';
import { GroupChannelListQuery } from '@sendbird/chat/groupChannel';

import { useFetchChannelList } from '../useFetchChannelList';
import { mockChannelList } from '../channelList.mock';
import { Nullable } from '../../../../../types';
import { MarkAsDeliveredSchedulerType } from '../../../../../lib/hooks/useMarkAsDeliveredScheduler';
import * as channelListActions from '../../../dux/actionTypes';
import React from 'react';
import { ChannelListActionTypes } from '../../../dux/actionTypes';
import { LoggerInterface } from '../../../../../lib/Logger';

interface GlobalContextType {
  mockChannelSource: Nullable<GroupChannelListQuery>,
  channelListDispatcher: Nullable<React.Dispatch<ChannelListActionTypes>>,
  markAsDeliveredScheduler: Nullable<MarkAsDeliveredSchedulerType>,
  logger: Nullable<LoggerInterface>,
}
const globalContext = {} as GlobalContextType;

describe('useFetchChannelList', () => {
  beforeEach(() => {
    globalContext.mockChannelSource = {
      hasNext: true,
      next: jest.fn(() => Promise.resolve(mockChannelList)),
    } as unknown as GroupChannelListQuery;
    globalContext.channelListDispatcher = jest.fn() as React.Dispatch<ChannelListActionTypes>;
    globalContext.markAsDeliveredScheduler = {
      push: jest.fn(),
      clear: jest.fn(),
      getQueue: jest.fn(),
    };
    globalContext.logger = {
      info: jest.fn(),
      warning: jest.fn(),
      error: jest.fn(),
    };
  });
  afterEach(() => {
    globalContext.mockChannelSource = null;
    globalContext.channelListDispatcher = null;
    globalContext.markAsDeliveredScheduler = null;
    globalContext.logger = null;
  });

  it('should update groupChannels after successful fetch channel list', async () => {
    const {
      mockChannelSource,
      channelListDispatcher,
      markAsDeliveredScheduler,
      logger,
    } = globalContext;
    const hook = renderHook(
      () => useFetchChannelList({
        channelSource: mockChannelSource,
        disableMarkAsDelivered: false,
      }, {
        channelListDispatcher,
        logger,
        markAsDeliveredScheduler,
      }),
    );
    const resultCallback = hook.result.current as unknown as () => void;
    await act(async () => {
      await resultCallback();
    });

    expect(channelListDispatcher).toHaveBeenCalledTimes(2);
    expect(mockChannelSource?.next).toHaveBeenCalledOnce();
    expect(channelListDispatcher).toHaveBeenNthCalledWith(1, {
      type: channelListActions.FETCH_CHANNELS_START,
      payload: null,
    });
    expect(channelListDispatcher).toHaveBeenNthCalledWith(2, {
      type: channelListActions.FETCH_CHANNELS_SUCCESS,
      payload: mockChannelList,
    });
  });

  it('should expect failure when failed fetching channel list', async () => {
    const mockError = { code: 0, message: 'Error message' };
    const {
      mockChannelSource,
      channelListDispatcher,
      markAsDeliveredScheduler,
      logger,
    } = globalContext;
    const hook = renderHook(
      () => useFetchChannelList({
        channelSource: {
          ...mockChannelSource,
          next: jest.fn(() => Promise.reject(mockError)),
        } as unknown as GroupChannelListQuery,
        disableMarkAsDelivered: false,
      }, {
        channelListDispatcher,
        logger,
        markAsDeliveredScheduler,
      }),
    );
    const resultCallback = hook.result.current as unknown as () => void;
    await act(async () => {
      await resultCallback();
    });

    expect(channelListDispatcher).toHaveBeenCalledTimes(2);
    expect(mockChannelSource?.next).not.toHaveBeenCalled();
    expect(channelListDispatcher).toHaveBeenNthCalledWith(1, {
      type: channelListActions.FETCH_CHANNELS_START,
      payload: null,
    });
    expect(channelListDispatcher).toHaveBeenNthCalledWith(2, {
      type: channelListActions.FETCH_CHANNELS_FAILURE,
      payload: mockError,
    });
  });

  it('should not try to fetch channel list when hasNext is false', async () => {
    const {
      mockChannelSource,
      channelListDispatcher,
      markAsDeliveredScheduler,
      logger,
    } = globalContext;
    const hook = renderHook(
      () => useFetchChannelList({
        channelSource: {
          ...mockChannelSource,
          hasNext: false,
        } as unknown as GroupChannelListQuery,
        disableMarkAsDelivered: false,
      }, {
        channelListDispatcher,
        logger,
        markAsDeliveredScheduler,
      }),
    );
    const resultCallback = hook.result.current as unknown as () => void;
    await act(async () => {
      await resultCallback();
    });

    expect(mockChannelSource?.next).not.toHaveBeenCalled();
    expect(channelListDispatcher).not.toHaveBeenCalled();
  });
});
