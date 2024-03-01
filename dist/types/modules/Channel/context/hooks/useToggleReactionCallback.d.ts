import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { BaseMessage } from '@sendbird/chat/message';
type UseToggleReactionCallbackOptions = {
    currentGroupChannel: GroupChannel | null;
};
type UseToggleReactionCallbackParams = {
    logger: LoggerInterface;
};
export default function useToggleReactionCallback({ currentGroupChannel }: UseToggleReactionCallbackOptions, { logger }: UseToggleReactionCallbackParams): (message: BaseMessage, key: string, isReacted: boolean) => void;
export {};
