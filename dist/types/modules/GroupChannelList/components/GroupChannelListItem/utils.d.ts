import type { GroupChannel } from '@sendbird/chat/groupChannel';
export declare const getChannelTitle: (channel?: GroupChannel, currentUserId?: string, stringSet?: import("../../../../ui/Label/stringSet").StringSet) => string;
export declare const getLastMessageCreatedAt: ({ channel, locale, stringSet }: {
    channel: any;
    locale: any;
    stringSet?: import("../../../../ui/Label/stringSet").StringSet;
}) => string;
export declare const getTotalMembers: (channel?: GroupChannel) => number;
export declare const getLastMessage: (channel?: GroupChannel, stringSet?: import("../../../../ui/Label/stringSet").StringSet) => any;
export declare const getChannelUnreadMessageCount: (channel?: GroupChannel) => number;
