export enum CHANNEL_TYPE {
  GROUP = 'group',
  SUPERGROUP = 'supergroup',
  BROADCAST = 'broadcast',
}

export type CustomButton = {
  label: string;
  channelType: CHANNEL_TYPE;
};
