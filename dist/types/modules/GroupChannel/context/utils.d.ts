import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { BaseMessage } from '@sendbird/chat/message';
import type { SendableMessage } from '@sendbird/chat/lib/__definition';
export declare function getComponentKeyFromMessage(message: BaseMessage | SendableMessage): string;
export declare function isContextMenuClosed(): boolean;
export declare function getMessageTopOffset(messageCreatedAt: number): number | null;
export declare const isDisabledBecauseFrozen: (groupChannel?: GroupChannel) => boolean;
export declare const isDisabledBecauseMuted: (groupChannel?: GroupChannel) => boolean;
