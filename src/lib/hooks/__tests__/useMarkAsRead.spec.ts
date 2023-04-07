import { renderHook } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import { useMarkAsRead } from '../useMarkAsRead';
import { LoggerFactory } from '../../Logger';

const logger = LoggerFactory('all');
describe('useMarkAsRead', () => {
  it('should return a markAsReadScheduler', () => {
    const { result } = renderHook(() => useMarkAsRead({ isConnected: true }, { logger }));
    expect(result.current.push).toBeDefined();
    expect(result.current.clear).toBeDefined();
  });

  it('should call clear queue when offline', () => {
    const { result, rerender } = renderHook(
      ({ isConnected, logger }) => {
        return useMarkAsRead({ isConnected }, { logger });
      }, {
        initialProps: {
          isConnected: true,
          logger: logger,
        },
      }
    );
    const channel = { markAsRead: jest.fn() } as unknown as GroupChannel;
    result.current.push(channel);
    expect(result.current.getQueue().length).toBe(1);
    rerender({ isConnected: false, logger });
    expect(result.current.getQueue().length).toBe(0);
  });
});
