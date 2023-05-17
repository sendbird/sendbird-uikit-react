import { renderHook } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';

jest.useFakeTimers();

import { useMarkAsDeliveredScheduler } from '../useMarkAsDeliveredScheduler';
import { LoggerFactory } from '../../Logger';
import { Logger } from '../../SendbirdState';

const logger = LoggerFactory('all') as Logger;
describe('useMarkAsDeliveredScheduler', () => {
  it('should return a markAsReadScheduler', () => {
    const { result } = renderHook(() => useMarkAsDeliveredScheduler({ isConnected: true }, { logger }));
    expect(result.current.push).toBeDefined();
    expect(result.current.clear).toBeDefined();
  });

  it('should call clear queue when offline', () => {
    const { result, rerender } = renderHook(
      ({ isConnected, logger }) => {
        return useMarkAsDeliveredScheduler({ isConnected }, { logger });
      }, {
        initialProps: {
          isConnected: true,
          logger: logger,
        },
      },
    );
    const channel = { markAsRead: jest.fn() } as unknown as GroupChannel;
    result.current.push(channel);
    expect(result.current.getQueue().length).toBe(1);
    rerender({ isConnected: false, logger });
    expect(result.current.getQueue().length).toBe(0);
  });

  it('should call markAsRead on intervals', () => {
    const { result, rerender } = renderHook(
      ({ isConnected, logger }) => {
        return useMarkAsDeliveredScheduler({ isConnected }, { logger });
      }, {
        initialProps: {
          isConnected: true,
          logger: logger,
        },
      },
    );
    const channel1 = { markAsRead: jest.fn(), url: '123' } as unknown as GroupChannel;
    const channel2 = { markAsRead: jest.fn(), url: '124' } as unknown as GroupChannel;
    result.current.push(channel1);
    result.current.push(channel2);
    jest.advanceTimersByTime(10000);
    expect(channel1.markAsRead).toHaveBeenCalledTimes(1);
    expect(channel2.markAsRead).toHaveBeenCalledTimes(1);
    expect(scheduler.getQueue().length).toBe(0);
  });
});
