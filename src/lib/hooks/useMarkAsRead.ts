import { GroupChannel } from "@sendbird/chat/groupChannel";
import { useEffect, useMemo } from "react";
import { Logger } from "../SendbirdState";

export type MarkAsReadSchedulerType = {
  push: (channel: GroupChannel) => void;
  clear: () => void;
};

const TIMEOUT = 5000;

export const schedulerFactory = (logger: Logger): MarkAsReadSchedulerType => {
  let queue: GroupChannel[] = [];
  let interval = null;
  const push = (channel: GroupChannel) => {
    queue.push(channel);
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
    }, TIMEOUT);
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
  };
}

interface DynamicParams {
  isConnected: boolean;
}

interface StaticParams {
  logger: Logger;
}

export function useMarkAsRead({
  isConnected,
}: DynamicParams, {
  logger,
}: StaticParams): MarkAsReadSchedulerType  {
  const markAsReadScheduler = useMemo(() => schedulerFactory(logger), [logger]);

  useEffect(() => {
    // for simplicity, we clear the queue when the connection is lost
    if (!isConnected) {
      markAsReadScheduler.clear()
      return;
    }
  }, [isConnected]);

  return markAsReadScheduler;
}
