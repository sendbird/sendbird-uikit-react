import { Logger } from '../../../../lib/SendbirdState';
import { SendMFMFunctionType } from './useSendMultipleFilesMessage';
import { SendableMessageType } from '../../../../utils';
import { SendFileMessageFunctionType } from '../../../Thread/context/hooks/useSendFileMessage';
import { FileMessage, MultipleFilesMessage } from '@sendbird/chat/message';
/**
 * The handleUploadFiles is a function sending a FileMessage and MultipleFilesMessage
 * by the received FileList from the ChangeEvent of MessageInput component.
 */
interface useHandleUploadFilesDynamicProps {
    sendFileMessage: SendFileMessageFunctionType;
    sendMultipleFilesMessage: SendMFMFunctionType;
    quoteMessage?: SendableMessageType;
}
interface useHandleUploadFilesStaticProps {
    logger: Logger;
}
export declare const useHandleUploadFiles: ({ sendFileMessage, sendMultipleFilesMessage, quoteMessage, }: useHandleUploadFilesDynamicProps, { logger, }: useHandleUploadFilesStaticProps) => (files: File[]) => Promise<void | FileMessage | MultipleFilesMessage>;
export {};
