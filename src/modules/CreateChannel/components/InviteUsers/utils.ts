import type { ApplicationUserListQuery } from '@sendbird/chat';
import type { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { CHANNEL_TYPE } from '../../types';
import { SdkStore } from '../../../../lib/types';

export const filterUser = (idsToFilter: string[]) => (currentId: string): boolean => idsToFilter?.includes(currentId);

export const setChannelType = (
  params: GroupChannelCreateParams,
  type: CHANNEL_TYPE,
): GroupChannelCreateParams => {
  if (type === 'broadcast') {
    // eslint-disable-next-line no-param-reassign
    params.isBroadcast = true;
  }
  if (type === 'supergroup') {
    // eslint-disable-next-line no-param-reassign
    params.isSuper = true;
  }
  return params;
};

type CreateDefaultUserListQueryType = {
  sdk: SdkStore['sdk'];
  userFilledApplicationUserListQuery?: ApplicationUserListQuery;
};

export const createDefaultUserListQuery = (
  { sdk, userFilledApplicationUserListQuery }: CreateDefaultUserListQueryType,
): ApplicationUserListQuery => {
  if (sdk?.createApplicationUserListQuery) {
    const params = sdk?.createApplicationUserListQuery({
      userIdsFilter: ['bot_test_0a780'],
    });
    if (userFilledApplicationUserListQuery) {
      Object.keys(userFilledApplicationUserListQuery).forEach((key) => {
        params[key] = userFilledApplicationUserListQuery[key];
      });
    }
    return params;
  }
};
