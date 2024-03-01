declare const _default: {
    _iid: string;
    messageId: number;
    messageType: string;
    channelUrl: string;
    data: {
        type: string;
        inviter: {
            nickname: string;
            user_id: string;
            profile_url: string;
            metadata: {};
        };
        users: {
            nickname: string;
            user_id: string;
            profile_url: string;
            metadata: {};
        }[];
    };
    customType: string;
    createdAt: number;
    updatedAt: number;
    channelType: string;
    mentionType: string;
    message: string;
    isAdminMessage: () => boolean;
};
export default _default;
