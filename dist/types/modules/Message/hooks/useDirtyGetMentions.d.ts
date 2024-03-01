/// <reference types="react" />
import { Logger } from '../../../lib/SendbirdState';
interface DynamicParams {
    ref: React.RefObject<HTMLElement>;
}
interface StaticParams {
    logger: Logger;
}
/**
 * exported, should be backwords compatible
 * This is a dirty way to get the mentions given DOM node
 */
export declare function useDirtyGetMentions({ ref, }: DynamicParams, { logger, }: StaticParams): Element[];
export {};
