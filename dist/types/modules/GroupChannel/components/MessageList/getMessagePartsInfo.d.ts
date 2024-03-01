import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CoreMessageType } from '../../../../utils';
export interface GetMessagePartsInfoProps {
    allMessages: Array<CoreMessageType>;
    isMessageGroupingEnabled: boolean;
    currentIndex: number;
    currentMessage: CoreMessageType;
    currentChannel: GroupChannel;
    replyType: string;
}
interface OutPuts {
    chainTop: boolean;
    chainBottom: boolean;
    hasSeparator: boolean;
}
/**
 * exported, should be backward compatible
 */
export declare const getMessagePartsInfo: ({ allMessages, isMessageGroupingEnabled, currentIndex, currentMessage, currentChannel, replyType, }: GetMessagePartsInfoProps) => OutPuts;
export {};
