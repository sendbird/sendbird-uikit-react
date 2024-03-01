import React from 'react';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import type { FileMessageCreateParams } from '@sendbird/chat/message';
import type { Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
interface DynamicParams {
    currentOpenChannel: OpenChannel;
    onBeforeSendFileMessage: (file: File) => FileMessageCreateParams;
    checkScrollBottom: () => boolean;
    imageCompression?: {
        compressionRate?: number;
        resizingWidth?: number | string;
        resizingHeight?: number | string;
    };
}
interface StaticParams {
    sdk: SdkStore['sdk'];
    logger: Logger;
    messagesDispatcher: (props: {
        type: string;
        payload: any;
    }) => void;
    scrollRef: React.MutableRefObject<HTMLElement>;
}
type CallbackReturn = (files: Array<File> | File) => void;
declare function useFileUploadCallback({ currentOpenChannel, imageCompression, onBeforeSendFileMessage, }: DynamicParams, { sdk, logger, messagesDispatcher, scrollRef }: StaticParams): CallbackReturn;
export default useFileUploadCallback;
