import { ReplyType as UpperCaseReplyType } from '../../types';
import { ThreadReplySelectType } from '../../modules/Channel/context/const';
type LowerCaseReplyType = Lowercase<UpperCaseReplyType>;
/**
 * Dashboard UIKitConfig's replyType is consisted of all lowercases,
 * we need to convert it into uppercase ones(or vice versa)
 * when we pass the value to internal components
 *  - 'thread' <-> 'THREAD'
 *  - 'quote_reply' <-> 'QUOTE_REPLY'
 */
export declare function getCaseResolvedReplyType(replyType: UpperCaseReplyType | LowerCaseReplyType): {
    lowerCase: LowerCaseReplyType;
    upperCase: UpperCaseReplyType;
};
type UpperCaseThreadReplySelectType = typeof ThreadReplySelectType[keyof typeof ThreadReplySelectType];
type LowerCaseThreadReplySelectType = Lowercase<UpperCaseThreadReplySelectType>;
/**
 * Dashboard UIKitConfig's threadReplySelectType is consisted of all lowercase letters,
 * we need to convert it into uppercase ones(or vice versa)
 * when we pass the value to internal components
 *  - 'thread' <-> 'THREAD'
 *  - 'parent' <-> 'PARENT'
 */
export declare function getCaseResolvedThreadReplySelectType(threadReplySelectType: UpperCaseThreadReplySelectType | LowerCaseThreadReplySelectType): {
    lowerCase: LowerCaseThreadReplySelectType;
    upperCase: UpperCaseThreadReplySelectType;
};
export {};
