import type { GroupChannel, GroupChannelListQuery } from '@sendbird/chat/groupChannel';
import { CreateAction } from '../../../utils/typeHelpers/reducers/createAction';

export const RESET_CHANNEL_LIST = 'RESET_CHANNEL_LIST';
export const CREATE_CHANNEL = 'CREATE_CHANNEL';
export const UNLOAD_CHANNELS = 'UNLOAD_CHANNELS';
export const SET_CHANNEL_LOADING = 'SET_CHANNEL_LOADING';
export const LEAVE_CHANNEL_SUCCESS = 'LEAVE_CHANNEL_SUCCESS';

export const SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL';

export const FETCH_CHANNELS_START = 'FETCH_CHANNELS_START';
export const FETCH_CHANNELS_SUCCESS = 'FETCH_CHANNELS_SUCCESS';
export const FETCH_CHANNELS_FAILURE = 'FETCH_CHANNELS_FAILURE';

export const INIT_CHANNELS_START = 'INIT_CHANNELS_START';
export const INIT_CHANNELS_SUCCESS = 'INIT_CHANNELS_SUCCESS';
export const INIT_CHANNELS_FAILURE = 'INIT_CHANNELS_FAILURE';

export const INVITE_MEMBERS_SUCESS = 'INVITE_MEMBERS_SUCESS';

export const ON_USER_JOINED = 'ON_USER_JOINED';
export const ON_CHANNEL_DELETED = 'ON_CHANNEL_DELETED';
export const ON_LAST_MESSAGE_UPDATED = 'ON_LAST_MESSAGE_UPDATED';
export const ON_USER_LEFT = 'ON_USER_LEFT';
export const ON_CHANNEL_CHANGED = 'ON_CHANNEL_CHANGED';
export const ON_CHANNEL_ARCHIVED = 'ON_CHANNEL_ARCHIVED';
export const ON_CHANNEL_FROZEN = 'ON_CHANNEL_FROZEN';
export const ON_CHANNEL_UNFROZEN = 'ON_CHANNEL_UNFROZEN';

export const ON_READ_RECEIPT_UPDATED = 'ON_READ_RECEIPT_UPDATED';
export const ON_DELIVERY_RECEIPT_UPDATED = 'ON_DELIVERY_RECEIPT_UPDATED';

export const CHANNEL_REPLACED_TO_TOP = 'CHANNEL_REPLACED_TO_TOP';
export const CHANNEL_LIST_PARAMS_UPDATED = 'CHANNEL_LIST_PARAMS_UPDATED';

type CHANNEL_LIST_PAYLOAD_TYPES = {
  [RESET_CHANNEL_LIST]: null;
  [CREATE_CHANNEL]: GroupChannel;
  [UNLOAD_CHANNELS]: null;
  [SET_CHANNEL_LOADING]: boolean;
  [LEAVE_CHANNEL_SUCCESS]: ChannelURL;
  [SET_CURRENT_CHANNEL]: GroupChannel | null;
  [FETCH_CHANNELS_START]: null;

  [FETCH_CHANNELS_SUCCESS]: GroupChannel[];
  [FETCH_CHANNELS_FAILURE]: null;
  [INIT_CHANNELS_START]: null;
  [INIT_CHANNELS_SUCCESS]: {
    channelList: GroupChannel[];
    disableAutoSelect: boolean;
  };
  [INIT_CHANNELS_FAILURE]: null;
  [INVITE_MEMBERS_SUCESS]: null;
  [ON_USER_JOINED]: GroupChannel;
  [ON_CHANNEL_DELETED]: ChannelURL;
  [ON_LAST_MESSAGE_UPDATED]: GroupChannel;
  [ON_USER_LEFT]: {
    isMe: boolean;
    channel: GroupChannel;
  };
  [ON_CHANNEL_CHANGED]: GroupChannel;
  [ON_CHANNEL_ARCHIVED]: GroupChannel;
  [ON_CHANNEL_FROZEN]: GroupChannel;
  [ON_CHANNEL_UNFROZEN]: GroupChannel;
  [ON_READ_RECEIPT_UPDATED]: GroupChannel;
  [ON_DELIVERY_RECEIPT_UPDATED]: GroupChannel;
  [CHANNEL_REPLACED_TO_TOP]: GroupChannel;
  [CHANNEL_LIST_PARAMS_UPDATED]: {
    channelListQuery: GroupChannelListQuery;
    currentUserId: string | undefined;
  };
};

type ChannelURL = string;

export type ChannelListActionTypes = CreateAction<CHANNEL_LIST_PAYLOAD_TYPES>;
