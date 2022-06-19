import type { ApplicationUserListQuery } from "@sendbird/chat";
import type { GroupChannelCreateParams, SendbirdGroupChat } from "@sendbird/chat/groupChannel";
import { CHANNEL_TYPE } from "../../types";

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
  sdk: SendbirdGroupChat;
  userFilledApplicationUserListQuery?: ApplicationUserListQuery;
}

export const createDefaultUserListQuery = (
  { sdk, userFilledApplicationUserListQuery }: CreateDefaultUserListQueryType
): ApplicationUserListQuery => {
  const params = sdk.createApplicationUserListQuery();
  if (userFilledApplicationUserListQuery) {
    Object.keys(userFilledApplicationUserListQuery).forEach((key) => {
      params[key] = userFilledApplicationUserListQuery[key];
    });
  }
  return params;
};
