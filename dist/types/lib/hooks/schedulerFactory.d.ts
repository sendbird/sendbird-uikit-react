import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Logger } from '../SendbirdState';
export declare function schedulerFactory<T>({ logger, timeout, cb, }: {
    logger: Logger;
    timeout?: number;
    cb: (item: T) => void;
}): {
    push: (channel: GroupChannel) => void;
    clear: () => void;
    getQueue: () => GroupChannel[];
};
