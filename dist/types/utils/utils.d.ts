import { SendableMessageType } from './index';
export declare const noop: () => void;
export declare const getSenderProfileUrl: (message: SendableMessageType) => string;
export declare const getSenderName: (message: SendableMessageType) => string;
export declare const isAboutSame: (a: number, b: number, px: number) => boolean;
export declare const isMobileIOS: (userAgent: string) => boolean;
declare const _default: {
    getSenderName: (message: SendableMessageType) => string;
    getSenderProfileUrl: (message: SendableMessageType) => string;
};
export default _default;
