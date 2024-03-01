import { Logger } from '../../../../lib/SendbirdState';
import { SendableMessageType } from '../../../../utils';
import { FileMessage, MultipleFilesMessage, MultipleFilesMessageCreateParams } from '@sendbird/chat/message';
import { FileMessageCreateParams } from '@sendbird/chat/lib/__definition';
/**
 * The handleUploadFiles is a function sending a FileMessage and MultipleFilesMessage
 * by the received FileList from the ChangeEvent of MessageInput component.
 */
interface useHandleUploadFilesDynamicProps {
    sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
    sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
    quoteMessage?: SendableMessageType;
}
interface useHandleUploadFilesStaticProps {
    logger: Logger;
}
export declare const useHandleUploadFiles: ({ sendFileMessage, sendMultipleFilesMessage, quoteMessage }: useHandleUploadFilesDynamicProps, { logger }: useHandleUploadFilesStaticProps) => (files: File[]) => Promise<void | FileMessage | MultipleFilesMessage>;
export {};
