import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Logger } from '../SendbirdState';

const TIMEOUT = 2000;

/*
  * This is a factory function that returns a scheduler.
  * The scheduler is a queue that calls the callback function on intervals.
  * If interval is empty, the callback function is called immediately.
  * If interval is not empty, the callback function is called after the interval.
*/
export function schedulerFactory<T>({
  logger,
  timeout,
  cb,
}: {
  logger: Logger;
  timeout?: number;
  cb: (item: T) => void;
}) {
  let queue: GroupChannel[] = [];
  let interval: ReturnType<typeof setTimeout> | null = null;
  const push = (channel: GroupChannel) => {
    const channelPresent = queue.find((c) => c.url === channel.url);
    if (!channelPresent) {
      queue.push(channel);
    } else {
      logger.info('Channel: Mark as read already in queue', { channel });
    }
    // start the interval if it's not already running
    if (interval) {
      return;
    }
    const item = queue.shift();
    cb(item as T);
    interval = setInterval(() => {
      if (queue.length === 0 && interval) {
        clearInterval(interval);
        interval = null;
        return;
      }
      const item = queue.shift();
      if (item) {
        cb(item as T);
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
}
