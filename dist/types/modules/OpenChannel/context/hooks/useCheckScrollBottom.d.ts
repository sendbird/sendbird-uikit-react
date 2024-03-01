/// <reference types="react" />
import { LoggerInterface } from '../../../../lib/Logger';
interface DynamicParams {
    conversationScrollRef: React.RefObject<HTMLDivElement>;
}
interface StaticParams {
    logger: LoggerInterface;
}
declare function useCheckScrollBottom({ conversationScrollRef }: DynamicParams, { logger }: StaticParams): () => boolean;
export default useCheckScrollBottom;
