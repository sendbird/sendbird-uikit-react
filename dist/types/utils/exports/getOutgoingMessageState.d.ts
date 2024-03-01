import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { Nullable } from '../../types';
import { CoreMessageType } from '../index';
export declare enum OutgoingMessageStates {
    NONE = "NONE",
    PENDING = "PENDING",
    SENT = "SENT",
    FAILED = "FAILED",
    DELIVERED = "DELIVERED",
    READ = "READ"
}
export declare const getOutgoingMessageState: (channel: Nullable<GroupChannel | OpenChannel>, message: CoreMessageType) => string;
