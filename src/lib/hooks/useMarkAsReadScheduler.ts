import { GroupChannel } from '@sendbird/chat/groupChannel';
import { useEffect, useMemo } from 'react';
import { Logger } from '../SendbirdState';

export type MarkAsReadSchedulerType = {
  push: (channel: GroupChannel) => void;
  clear: () => void;
  getQueue: () => GroupChannel[];
};

const TIMEOUT = 5000;

export const schedulerFactory = (logger: Logger, timeout?: number): MarkAsReadSchedulerType => {
  let queue: GroupChannel[] = [];
  let interval = null;
  const push = (channel: GroupChannel) => {
    const channelPresent = queue.find((c) => c.url === channel.url);
    if (!channelPresent) {
      queue.push(channel);
    } else {
      logger.info('Channel: Mark as read already in queue', channel);
    }
    // start the interval if it's not already running
    if (interval) {
      return;
    }
    interval = setInterval(() => {
      if (queue.length === 0) {
        clearInterval(interval);
        interval = null;
        return;
      }
      const channel = queue.shift();
      if (channel) {
        try {
          channel.markAsRead();
        } catch (error) {
          logger.error('Channel: Mark as read failed', error);
        }
      }
    }, (timeout || TIMEOUT));
  };
  const clear = () => {
    queue = [];
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };
  return {
    push,
    clear,
    getQueue: () => queue,
  };
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
  const markAsReadScheduler = useMemo(() => schedulerFactory(logger), []);

  useEffect(() => {
    // for simplicity, we clear the queue when the connection is lost
    if (!isConnected) {
      markAsReadScheduler.clear();
      return;
    }
  }, [isConnected]);

  return markAsReadScheduler;
}
