import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Logger } from '../SendbirdState';

const TIMEOUT = 5000;

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
  let interval: NodeJS.Timer | null = null;
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
    interval = setInterval(() => {
      if (queue.length === 0 && interval) {
        clearInterval(interval);
        interval = null;
        return;
      }
      const item = queue.shift();
      cb(item as T);
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
