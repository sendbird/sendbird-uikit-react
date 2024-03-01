import { CoreMessageType } from '../../utils';
import { Thumbnail } from '@sendbird/chat/lib/__definition';
export declare function getMessageFirstFileType(message: CoreMessageType): string;
export declare function getMessageFirstFileName(message: CoreMessageType): string;
export declare function getMessageFirstFileUrl(message: CoreMessageType): string;
export declare function getMessageFirstFileThumbnails(message: CoreMessageType): Thumbnail[];
export declare function getMessageFirstFileThumbnailUrl(message: CoreMessageType): string;
