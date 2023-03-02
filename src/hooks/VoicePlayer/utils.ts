export type GroupKey = string;
export const generateGroupKey = (channelUrl = '', key = ''): GroupKey => (`${channelUrl}-${key}`);
