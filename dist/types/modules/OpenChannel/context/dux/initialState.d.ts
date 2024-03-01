import type { User } from '@sendbird/chat';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { CoreMessageType } from '../../../../utils';
export interface State {
    allMessages: Array<CoreMessageType>;
    loading: boolean;
    initialized: boolean;
    currentOpenChannel: OpenChannel;
    isInvalid: boolean;
    hasMore: boolean;
    lastMessageTimestamp: number;
    frozen: boolean;
    operators: Array<User>;
    participants: Array<User>;
    bannedParticipantIds: Array<string>;
    mutedParticipantIds: Array<string>;
}
declare const initialState: State;
export default initialState;
