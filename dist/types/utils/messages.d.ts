import { type BaseMessage } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { ReplyType } from '../types';
import type { CoreMessageType } from '.';
/**
 * exported, should be backward compatible
 * @returns [chainTop: `boolean`, chainBottom: `boolean`]
 */
export declare const compareMessagesForGrouping: (prevMessage: CoreMessageType, currMessage: CoreMessageType, nextMessage: CoreMessageType, currentChannel?: GroupChannel, replyType?: ReplyType) => boolean[];
export declare const getMessageCreatedAt: (message: BaseMessage) => string;
export declare const isSameGroup: (message: CoreMessageType, comparingMessage: CoreMessageType, currentChannel?: GroupChannel) => boolean;
declare const _default: {
    compareMessagesForGrouping: (prevMessage: CoreMessageType, currMessage: CoreMessageType, nextMessage: CoreMessageType, currentChannel?: GroupChannel, replyType?: ReplyType) => boolean[];
    getMessageCreatedAt: (message: BaseMessage) => string;
    isSameGroup: (message: CoreMessageType, comparingMessage: CoreMessageType, currentChannel?: GroupChannel) => boolean;
};
export default _default;
