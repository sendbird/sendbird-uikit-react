import { Logger } from '../../../../lib/SendbirdState';
import { SendableMessageType } from '../../../../utils';
import { SdkStore } from '../../../../lib/types';
interface DynamicProps {
    channelUrl: string;
    sdkInit: boolean;
    message: SendableMessageType;
}
interface StaticProps {
    sdk: SdkStore['sdk'];
    logger: Logger;
    threadDispatcher: (props: {
        type: string;
        payload?: any;
    }) => void;
}
export default function useGetChannel({ channelUrl, sdkInit, message, }: DynamicProps, { sdk, logger, threadDispatcher, }: StaticProps): void;
export {};
