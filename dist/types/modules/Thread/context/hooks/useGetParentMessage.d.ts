import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { BaseMessage } from '@sendbird/chat/message';
import { SdkStore } from '../../../../lib/types';
interface DynamicProps {
    channelUrl: string;
    sdkInit: boolean;
    parentMessage?: BaseMessage;
}
interface StaticProps {
    sdk: SdkStore['sdk'];
    logger: Logger;
    threadDispatcher: CustomUseReducerDispatcher;
}
export default function useGetParentMessage({ channelUrl, sdkInit, parentMessage, }: DynamicProps, { sdk, logger, threadDispatcher, }: StaticProps): void;
export {};
