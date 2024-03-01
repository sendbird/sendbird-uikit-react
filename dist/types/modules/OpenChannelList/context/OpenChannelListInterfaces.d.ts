import { OpenChannel } from '@sendbird/chat/openChannel';
import { Dispatch } from 'react';
import { Logger } from '../../../lib/SendbirdState';
import OpenChannelListActionTypes from './dux/actionTypes';
import { FetchNextCallbackType } from './hooks/useFetchNextCallback';
export interface UserFilledOpenChannelListQuery {
    customTypes?: Array<string>;
    includeFrozen?: boolean;
    includeMetaData?: boolean;
    limit?: number;
    nameKeyword?: string;
    urlKeyword?: string;
}
export declare enum OpenChannelListFetchingStatus {
    EMPTY = "EMPTY",
    FETCHING = "FETCHING",
    DONE = "DONE",
    ERROR = "ERROR"
}
export type OnOpenChannelSelected = (channel: OpenChannel, e?: React.MouseEvent<HTMLDivElement | unknown>) => void;
export type OpenChannelListDispatcherType = Dispatch<{
    type: OpenChannelListActionTypes;
    payload: any;
}>;
export interface OpenChannelListProviderProps {
    className?: string;
    children?: React.ReactElement;
    queries?: {
        openChannelListQuery?: UserFilledOpenChannelListQuery;
    };
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
    openChannelListDispatcher: OpenChannelListDispatcherType;
}
