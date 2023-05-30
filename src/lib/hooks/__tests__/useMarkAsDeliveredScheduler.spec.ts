import { renderHook } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import { useMarkAsDeliveredScheduler } from '../useMarkAsDeliveredScheduler';
import { LoggerFactory } from '../../Logger';
import { Logger } from '../../SendbirdState';

jest.useFakeTimers();

const logger = LoggerFactory('all') as Logger;
describe('useMarkAsDeliveredScheduler', () => {
  it('should return a markAsDeliveredScheduler', () => {
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
    const channel1 = { markAsDelivered: jest.fn(), url: '1' } as unknown as GroupChannel;
    const channel2 = { markAsDelivered: jest.fn(), url: '2' } as unknown as GroupChannel;
    result.current.push(channel1);
    result.current.push(channel2);
    expect(result.current.getQueue().length).toBe(1);
    rerender({ isConnected: false, logger });
    expect(result.current.getQueue().length).toBe(0);
  });

  it('should call markAsDelivered on intervals', () => {
    const { result } = renderHook(
      ({ isConnected, logger }) => {
        return useMarkAsDeliveredScheduler({ isConnected }, { logger });
      }, {
        initialProps: {
          isConnected: true,
          logger: logger,
        },
      },
    );
    const channel1 = { markAsDelivered: jest.fn(), url: '123' } as unknown as GroupChannel;
    const channel2 = { markAsDelivered: jest.fn(), url: '124' } as unknown as GroupChannel;
    result.current.push(channel1);
    expect(channel1.markAsDelivered).toHaveBeenCalledTimes(1);
    result.current.push(channel2);
    jest.advanceTimersByTime(10000);
    expect(channel2.markAsDelivered).toHaveBeenCalledTimes(1);
    expect(result.current.getQueue().length).toBe(0);
  });
});
