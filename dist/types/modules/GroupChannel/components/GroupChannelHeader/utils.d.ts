import type { GroupChannel } from '@sendbird/chat/groupChannel';
export declare const getChannelTitle: (channel: GroupChannel, currentUserId: string, stringSet: {
    [label: string]: string;
}) => string;
