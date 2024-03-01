import type { OpenChannel } from '@sendbird/chat/openChannel';
import type { Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
interface DynamicParams {
    channelUrl: string;
    sdkInit: boolean;
    fetchingParticipants: boolean;
    userId: string;
    currentOpenChannel: OpenChannel;
}
interface StaticParams {
    sdk: SdkStore['sdk'];
    logger: Logger;
    messagesDispatcher: ({ type, payload }: {
        type: string;
        payload: any;
    }) => void;
}
declare function useSetChannel({ channelUrl, sdkInit, fetchingParticipants, userId, currentOpenChannel }: DynamicParams, { sdk, logger, messagesDispatcher }: StaticParams): void;
export default useSetChannel;
