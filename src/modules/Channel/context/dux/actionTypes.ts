import { CreateAction } from '../../../../utils/typeHelpers/reducers/createAction';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CoreMessageType, SendableMessageType } from '../../../../utils';
import { EmojiContainer } from '@sendbird/chat';
import { ReactionEvent } from '@sendbird/chat/message';
import { MessageListParams } from '../ChannelProvider';
import { FileUploadedPayload } from '../hooks/useSendMultipleFilesMessage';

export const RESET_MESSAGES = 'RESET_MESSAGES';
export const FETCH_INITIAL_MESSAGES_START = 'FETCH_INITIAL_MESSAGES_START';
export const FETCH_INITIAL_MESSAGES_SUCCESS = 'FETCH_INITIAL_MESSAGES_SUCCESS';
export const FETCH_INITIAL_MESSAGES_FAILURE = 'FETCH_INITIAL_MESSAGES_FAILURE';
export const FETCH_PREV_MESSAGES_SUCCESS = 'FETCH_PREV_MESSAGES_SUCCESS';
export const FETCH_PREV_MESSAGES_FAILURE = 'FETCH_PREV_MESSAGES_FAILURE';
export const FETCH_NEXT_MESSAGES_SUCCESS = 'FETCH_NEXT_MESSAGES_SUCCESS';
export const FETCH_NEXT_MESSAGES_FAILURE = 'FETCH_NEXT_MESSAGES_FAILURE';
export const SEND_MESSAGE_START = 'SEND_MESSAGE_START';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';
export const RESEND_MESSAGE_START = 'RESEND_MESSAGE_START';
export const ON_MESSAGE_RECEIVED = 'ON_MESSAGE_RECEIVED';
export const ON_MESSAGE_UPDATED = 'ON_MESSAGE_UPDATED';
export const ON_MESSAGE_THREAD_INFO_UPDATED = 'ON_MESSAGE_THREAD_INFO_UPDATED';
export const ON_MESSAGE_DELETED = 'ON_MESSAGE_DELETED';
export const ON_MESSAGE_DELETED_BY_REQ_ID = 'ON_MESSAGE_DELETED_BY_REQ_ID';
export const SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL';
export const SET_CHANNEL_INVALID = 'SET_CHANNEL_INVALID';
export const MARK_AS_READ = 'MARK_AS_READ';
export const ON_REACTION_UPDATED = 'ON_REACTION_UPDATED';
export const SET_EMOJI_CONTAINER = 'SET_EMOJI_CONTAINER';
export const MESSAGE_LIST_PARAMS_CHANGED = 'MESSAGE_LIST_PARAMS_CHANGED';
export const ON_FILE_INFO_UPLOADED = 'ON_FILE_INFO_UPLOADED';

type CHANNEL_PAYLOAD_TYPES = {
  [RESET_MESSAGES]: null;
  [FETCH_INITIAL_MESSAGES_START]: null;
  [FETCH_INITIAL_MESSAGES_SUCCESS]: {
    currentGroupChannel: null | GroupChannel;
    messages: CoreMessageType[];
  };
  [FETCH_PREV_MESSAGES_SUCCESS]: {
    currentGroupChannel: null | GroupChannel;
    messages: CoreMessageType[];
  };
  [FETCH_NEXT_MESSAGES_SUCCESS]: {
    currentGroupChannel: null | GroupChannel;
    messages: CoreMessageType[];
  };
  [FETCH_INITIAL_MESSAGES_FAILURE]: {
    currentGroupChannel: null | GroupChannel;
  };
  [FETCH_PREV_MESSAGES_FAILURE]: {
    currentGroupChannel: null | GroupChannel;
  };
  [FETCH_NEXT_MESSAGES_FAILURE]: {
    currentGroupChannel: null | GroupChannel;
  };
  [SEND_MESSAGE_START]: SendableMessageType;
  [SEND_MESSAGE_SUCCESS]: SendableMessageType;
  [SEND_MESSAGE_FAILURE]: SendableMessageType;
  [SET_CURRENT_CHANNEL]: null | GroupChannel;
  [SET_CHANNEL_INVALID]: null;
  [ON_MESSAGE_RECEIVED]: {
    channel: GroupChannel;
    message: SendableMessageType;
  };
  [ON_MESSAGE_UPDATED]: {
    channel: GroupChannel;
    message: SendableMessageType;
  };
  [ON_MESSAGE_THREAD_INFO_UPDATED]: {
    channel: GroupChannel;
    event: any;
  };
  [RESEND_MESSAGE_START]: SendableMessageType;
  [MARK_AS_READ]: {
    channel: null | GroupChannel;
  };
  [ON_MESSAGE_DELETED]: MessageId;
  [ON_MESSAGE_DELETED_BY_REQ_ID]: RequestId;
  [SET_EMOJI_CONTAINER]: EmojiContainer;
  [ON_REACTION_UPDATED]: ReactionEvent;
  [MESSAGE_LIST_PARAMS_CHANGED]: MessageListParams;
  [ON_FILE_INFO_UPLOADED]: FileUploadedPayload;
};

type MessageId = number;
type RequestId = string;

export type ChannelActionTypes = CreateAction<CHANNEL_PAYLOAD_TYPES>;
