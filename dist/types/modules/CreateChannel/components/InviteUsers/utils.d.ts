import type { ApplicationUserListQuery } from '@sendbird/chat';
import type { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { CHANNEL_TYPE } from '../../types';
import { SdkStore } from '../../../../lib/types';
export declare const filterUser: (idsToFilter: string[]) => (currentId: string) => boolean;
export declare const setChannelType: (params: GroupChannelCreateParams, type: CHANNEL_TYPE) => GroupChannelCreateParams;
type CreateDefaultUserListQueryType = {
    sdk: SdkStore['sdk'];
    userFilledApplicationUserListQuery?: ApplicationUserListQuery;
};
export declare const createDefaultUserListQuery: ({ sdk, userFilledApplicationUserListQuery }: CreateDefaultUserListQueryType) => ApplicationUserListQuery;
export {};
