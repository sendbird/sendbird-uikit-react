import SendBird from 'sendbird';

export const isBroadcastChannelEnabled = (sdk: SendBird.SendBirdInstance): boolean => {
  const ALLOW_BROADCAST_CHANNEL = 'allow_broadcast_channel';
  const applicationAttributes = sdk?.appInfo?.applicationAttributes;

  if (Array.isArray(applicationAttributes)) {
    return applicationAttributes.includes(ALLOW_BROADCAST_CHANNEL);
  }

  return false;
};

export const isSuperGroupChannelEnabled = (sdk: SendBird.SendBirdInstance): boolean => {
  const ALLOW_SUPER_GROUP_CHANNEL = 'allow_super_group_channel';
  const applicationAttributes = sdk?.appInfo?.applicationAttributes;

  if (Array.isArray(applicationAttributes)) {
    return applicationAttributes.includes(ALLOW_SUPER_GROUP_CHANNEL);
  }

  return false;
};
