import { renderHook } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import { useMarkAsReadScheduler } from '../useMarkAsReadScheduler';
import { LoggerFactory } from '../../Logger';
import { Logger } from '../../SendbirdState';

const logger = LoggerFactory('all') as Logger;
describe('useMarkAsReadScheduler', () => {
  it('should return a markAsReadScheduler', () => {
    const { result } = renderHook(() => useMarkAsReadScheduler({ isConnected: true }, { logger }));
    expect(result.current.push).toBeDefined();
    expect(result.current.clear).toBeDefined();
  });

  it('should call clear queue when offline', () => {
    const { result, rerender } = renderHook(
      ({ isConnected, logger }) => {
        return useMarkAsReadScheduler({ isConnected }, { logger });
      }, {
        initialProps: {
          isConnected: true,
          logger: logger,
        },
      },
    );
    const channel1 = { markAsRead: jest.fn(), url: '1' } as unknown as GroupChannel;
    const channel2 = { markAsRead: jest.fn(), url: '2' } as unknown as GroupChannel;
    result.current.push(channel1);
    result.current.push(channel2);
    expect(result.current.getQueue().length).toBe(1);
    rerender({ isConnected: false, logger });
    expect(result.current.getQueue().length).toBe(0);
  });
});
