import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
interface DanamicPrpos {
    sdk: SdkStore['sdk'];
}
interface StaticProps {
    logger: Logger;
    threadDispatcher: CustomUseReducerDispatcher;
}
export default function useGetAllEmoji({ sdk, }: DanamicPrpos, { logger, threadDispatcher, }: StaticProps): void;
export {};
