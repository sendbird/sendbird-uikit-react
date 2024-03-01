import { GroupChannel } from '@sendbird/chat/groupChannel';
type CurrentChannelType = GroupChannel | null;
export interface GetNextChannelParams {
    channel: GroupChannel;
    currentChannel: CurrentChannelType;
    allChannels: GroupChannel[];
    disableAutoSelect: boolean;
}
/**
 * NOTICE: Use this function IF the current channel is removed from allChannels.
 * This function will give you the next currentChannel value.
 */
export declare const getNextChannel: ({ channel, currentChannel, allChannels, disableAutoSelect, }: GetNextChannelParams) => CurrentChannelType;
export {};
