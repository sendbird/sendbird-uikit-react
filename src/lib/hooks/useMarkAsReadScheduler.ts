import { useEffect, useMemo } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import { schedulerFactory } from './schedulerFactory';
import { Logger } from '../SendbirdState';
import { useUnmount } from '../../hooks/useUnmount';

export type MarkAsReadSchedulerType = {
  push: (channel: GroupChannel) => void;
  clear: () => void;
  getQueue: () => GroupChannel[];
};

interface DynamicParams {
  isConnected: boolean;
}

interface StaticParams {
  logger: Logger;
}

export function useMarkAsReadScheduler({
  isConnected,
}: DynamicParams, {
  logger,
}: StaticParams): MarkAsReadSchedulerType {
  const markAsReadScheduler = useMemo(() => schedulerFactory<GroupChannel>({
    logger,
    cb: (channel) => {
      try {
        channel.markAsRead();
      } catch (error) {
        logger.warning('Channel: Mark as delivered failed', { channel, error });
      }
    },
  }), []);

  useEffect(() => {
    // for simplicity, we clear the queue when the connection is lost
    if (!isConnected) {
      markAsReadScheduler.clear();
    }
  }, [isConnected]);

  useUnmount(() => { markAsReadScheduler.clear(); });

  return markAsReadScheduler;
}
