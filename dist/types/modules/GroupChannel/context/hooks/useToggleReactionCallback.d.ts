import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { BaseMessage } from '@sendbird/chat/message';
export default function useToggleReactionCallback(currentChannel: GroupChannel | null, logger?: LoggerInterface): (message: BaseMessage, key: string, isReacted: boolean) => void;
