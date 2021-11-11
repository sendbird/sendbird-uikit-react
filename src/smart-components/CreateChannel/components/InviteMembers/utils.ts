import SendBird from "sendbird";
import { CHANNEL_TYPE } from "../../types";

export const filterUser = (idsToFilter: string[]) => (currentId: string): boolean => idsToFilter?.includes(currentId);

export const setChannelType = (
  params: SendBird.GroupChannelParams,
  type: CHANNEL_TYPE,
): SendBird.GroupChannelParams => {
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
  sdk: SendBird.SendBirdInstance;
  userFilledApplicationUserListQuery?: SendBird.ApplicationUserListQuery;
}

export const createDefaultUserListQuery = (
  { sdk, userFilledApplicationUserListQuery }: CreateDefaultUserListQueryType
): SendBird.ApplicationUserListQuery => {
  const params = sdk.createApplicationUserListQuery();
  if (userFilledApplicationUserListQuery) {
    Object.keys(userFilledApplicationUserListQuery).forEach((key) => {
      params[key] = userFilledApplicationUserListQuery[key];
    });
  }
  return params;
};
