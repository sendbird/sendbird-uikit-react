import { CoreMessageType } from '../../../../utils';
export declare const MessageTypes: {
    ADMIN: string;
    USER: string;
    FILE: string;
    THUMBNAIL: string;
    OG: string;
    UNKNOWN: string;
};
export declare const SendingMessageStatus: {
    NONE: string;
    SUCCEEDED: string;
    FAILED: string;
    PENDING: string;
};
type MessageTypeOptions = {
    isOgMessageEnabledInOpenChannel?: boolean;
};
export declare const getMessageType: (message: CoreMessageType, options?: MessageTypeOptions) => string;
declare const _default: {
    MessageTypes: {
        ADMIN: string;
        USER: string;
        FILE: string;
        THUMBNAIL: string;
        OG: string;
        UNKNOWN: string;
    };
    SendingMessageStatus: {
        NONE: string;
        SUCCEEDED: string;
        FAILED: string;
        PENDING: string;
    };
    getMessageType: (message: CoreMessageType, options?: MessageTypeOptions) => string;
};
export default _default;
