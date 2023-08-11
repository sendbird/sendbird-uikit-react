import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react";
import { GroupChannelListQuery } from "@sendbird/chat/groupChannel";

import { useFetchChannelList } from "../useFetchChannelList";
import { mockChannelList } from "./channellist.mock";
import { DELIVERY_RECEIPT } from "../../../../../utils/consts";
import { CustomUseReducerDispatcher, Logger } from "../../../../../lib/SendbirdState";
import { Nullable } from "../../../../../types";
import { MarkAsDeliveredSchedulerType } from "../../../../../lib/hooks/useMarkAsDeliveredScheduler";
import * as channelListActions from "../../../dux/actionTypes";

interface GlobalContextType {
  mockChannelSource: Nullable<GroupChannelListQuery>,
  channelListDispatcher: Nullable<CustomUseReducerDispatcher>,
  markAsDeliveredScheduler: Nullable<MarkAsDeliveredSchedulerType>,
  logger: Nullable<Logger>,
}
const mockPremiumFeatureList = [DELIVERY_RECEIPT];
const mockLogSubtitle = 'TestSubtitle';
const globalContext = {} as GlobalContextType;

describe('useFetchChannelList', () => {
  beforeEach(() => {
    globalContext.mockChannelSource = {
      hasNext: true,
      // next: jest.fn(() => (
      //   new Promise((resolve) => {
      //     const channelList = mockChannelList;
      //     resolve(channelList);
      //   })
      // )),
      next: jest.fn(() => Promise.resolve(mockChannelList)),
    } as unknown as GroupChannelListQuery;
    globalContext.channelListDispatcher = jest.fn() as CustomUseReducerDispatcher;
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

  it('should update allChannels after successful fetch channel list', async () => {
    const {
      mockChannelSource,
      channelListDispatcher,
      markAsDeliveredScheduler,
      logger,
    } = globalContext;
    const hook = renderHook(
      () => useFetchChannelList({
        channelSource: mockChannelSource,
        premiumFeatureList: mockPremiumFeatureList,
        disableMarkAsDelivered: false,
      }, {
        channelListDispatcher: channelListDispatcher as CustomUseReducerDispatcher,
        logSubtitle: mockLogSubtitle,
        logger: logger as Logger,
        markAsDeliveredScheduler: markAsDeliveredScheduler as MarkAsDeliveredSchedulerType,
      })
    );
    const resultCallback= hook.result.current as unknown as () => void;
    await act(async () => {
      await resultCallback();
    });

    jest.advanceTimersByTime(1000);

    // expect(logger?.warning).not.toHaveBeenCalled();
    // expect(logger?.error).not.toHaveBeenCalled();

    expect(channelListDispatcher).toHaveBeenCalledTimes(2);
    // expect(logger?.info).toHaveBeenNthCalledWith(1, `${mockLogSubtitle}: starting fetch`);
    expect(channelListDispatcher).toHaveBeenNthCalledWith(1, {
      type: channelListActions.FETCH_CHANNELS_START,
      payload: null,
    });
    expect(mockChannelSource?.next).toHaveBeenCalledOnce();

    // expect(logger?.info).toHaveBeenNthCalledWith(2, `${mockLogSubtitle}: succeeded fetch`, { channelList: mockChannelList });
    expect(channelListDispatcher).toHaveBeenNthCalledWith(2, {
      type: channelListActions.FETCH_CHANNELS_SUCCESS,
      payload: mockChannelList,
    });
    // expect(logger?.info).not.toHaveBeenNthCalledWith(3, `${mockLogSubtitle}: mark as delivered to fetched channels`);
  });

  it('should expect failure when failed fetching channel list', () => {
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
        premiumFeatureList: mockPremiumFeatureList,
        disableMarkAsDelivered: false,
      }, {
        channelListDispatcher: channelListDispatcher as CustomUseReducerDispatcher,
        logSubtitle: mockLogSubtitle,
        logger: logger as Logger,
        markAsDeliveredScheduler: markAsDeliveredScheduler as MarkAsDeliveredSchedulerType,
      })
    );
    const resultCallback= hook.result.current as unknown as () => void;
    act(() => {
      resultCallback();
    });

    expect(logger?.info).toHaveBeenCalledOnce();
    expect(logger?.error).toHaveBeenCalledOnce();

    expect(logger?.warning).not.toHaveBeenCalled();
    expect(channelListDispatcher).not.toHaveBeenCalled();

    expect(logger?.error).toHaveBeenCalledWith(`${mockLogSubtitle}: failed fetch`, { err: mockError });
  });
});
