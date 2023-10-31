import { SdkStore } from '../../lib/types';

export const isBroadcastChannelEnabled = (sdk: SdkStore['sdk']): boolean => {
  const ALLOW_BROADCAST_CHANNEL = 'allow_broadcast_channel';
  const applicationAttributes = sdk?.appInfo?.applicationAttributes;

  if (Array.isArray(applicationAttributes)) {
    return applicationAttributes.includes(ALLOW_BROADCAST_CHANNEL);
  }

  return false;
};

export const isSuperGroupChannelEnabled = (sdk: SdkStore['sdk']): boolean => {
  const ALLOW_SUPER_GROUP_CHANNEL = 'allow_super_group_channel';
  const applicationAttributes = sdk?.appInfo?.applicationAttributes;

  if (Array.isArray(applicationAttributes)) {
    return applicationAttributes.includes(ALLOW_SUPER_GROUP_CHANNEL);
  }

  return false;
};
