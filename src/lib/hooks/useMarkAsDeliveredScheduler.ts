import { useEffect, useMemo } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import { schedulerFactory } from './schedulerFactory';
import { Logger } from '../SendbirdState';
import { useUnmount } from '../../hooks/useUnmount';

export type MarkAsDeliveredSchedulerType = {
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

export function useMarkAsDeliveredScheduler({
  isConnected,
}: DynamicParams, {
  logger,
}: StaticParams): MarkAsDeliveredSchedulerType {
  const markAsDeliveredScheduler = useMemo(() => schedulerFactory<GroupChannel>({
    logger,
    cb: (channel) => {
      try {
        channel.markAsDelivered();
      } catch (error) {
        logger.warning('Channel: Mark as delivered failed', { channel, error });
      }
    },
  }), []);

  useEffect(() => {
    // for simplicity, we clear the queue when the connection is lost
    if (!isConnected) {
      markAsDeliveredScheduler.clear();
    }
  }, [isConnected]);

  useUnmount(() => { markAsDeliveredScheduler.clear(); })

  return markAsDeliveredScheduler;
}
