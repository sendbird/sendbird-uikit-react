import type { Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
interface MainProps {
    channelUrl: string;
    sdkInit: boolean;
}
interface ToolProps {
    sdk: SdkStore['sdk'];
    logger: Logger;
    messageSearchDispatcher: (param: {
        type: string;
        payload: any;
    }) => void;
}
declare function useSetChannel({ channelUrl, sdkInit }: MainProps, { sdk, logger, messageSearchDispatcher }: ToolProps): void;
export default useSetChannel;
