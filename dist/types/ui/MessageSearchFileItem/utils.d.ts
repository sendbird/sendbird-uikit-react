import type { FileMessage } from '@sendbird/chat/message';
import type { Locale } from 'date-fns';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { Types } from '../Icon/type';
export interface GetCreatedAtProps {
    createdAt: number;
    locale?: Locale;
    stringSet?: Record<string, string>;
}
export declare function getCreatedAt({ createdAt, locale, stringSet }: GetCreatedAtProps): string;
export declare function getIconOfFileType(message: FileMessage | MultipleFilesMessage): Types;
export declare function truncate(fullText: string, textLimit: number): string;
