import { OpenChannel } from '@sendbird/chat/openChannel';
import { CustomUseReducerDispatcher, Logger } from '../../../lib/SendbirdState';
import { FetchNextCallbackType } from './hooks/useFetchNextCallback';

export interface UserFilledOpenChannelListQuery {
  // https://sendbird.com/docs/chat/v4/javascript/ref/interfaces/_sendbird_chat_openChannel.OpenChannelListQueryParams.html
  customTypes?: Array<string>;
  includeFrozen?: boolean;
  includeMetaData?: boolean;
  limit?: number;
  nameKeyword?: string;
  urlKeyword?: string;
}

export enum OpenChannelListFetchingStatus {
  EMPTY,
  FETCHING,
  DONE,
  ERROR,
}

export type OnOpenChannelSelected = (channel: OpenChannel, e?: React.MouseEvent<HTMLDivElement | unknown>) => void;

export interface OpenChannelListProviderProps {
  className?: string;
  children?: React.ReactElement;
  queries?: { openChannelListQuery?: UserFilledOpenChannelListQuery };
  onChannelSelected?: OnOpenChannelSelected;
}

export interface OpenChannelListProviderInterface extends OpenChannelListProviderProps {
  logger: Logger;
  currentChannel: OpenChannel;
  allChannels: Array<OpenChannel>;
  fetchingStatus: OpenChannelListFetchingStatus;
  customOpenChannelListQuery?: UserFilledOpenChannelListQuery;
  fetchNextChannels: FetchNextCallbackType;
  refreshOpenChannelList: () => void;
  openChannelListDispatcher: CustomUseReducerDispatcher;
}
