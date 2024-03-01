import type { UserMessage } from '@sendbird/chat/message';
export declare const URL_REG: RegExp;
export declare const createUrlTester: (regexp: RegExp) => (text: string) => boolean;
export declare const checkOGIsEnalbed: (message: UserMessage) => boolean;
