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
export function getCaseResolvedReplyType(replyType: UpperCaseReplyType | LowerCaseReplyType): {
  lowerCase: LowerCaseReplyType;
  upperCase: UpperCaseReplyType;
} {

  return {
    lowerCase: <LowerCaseReplyType>replyType.toLowerCase(),
    upperCase: <UpperCaseReplyType>replyType.toUpperCase(),
  };
}

type UpperCaseThreadReplySelectType = typeof ThreadReplySelectType[keyof typeof ThreadReplySelectType];
type LowerCaseThreadReplySelectType = Lowercase<UpperCaseThreadReplySelectType>;

/**
 * Dashboard UIKitConfig's threadReplySelectType is consisted of all lowercase letters,
 * we need to convert it into uppercase ones(or vice versa)
 * when we pass the value to internal components
 *  - 'thread' <-> 'THREAD'
 *  - 'parent' <-> 'PARENT'
 */
export function getCaseResolvedThreadReplySelectType(threadReplySelectType: UpperCaseThreadReplySelectType | LowerCaseThreadReplySelectType): {
  lowerCase: LowerCaseThreadReplySelectType;
  upperCase: UpperCaseThreadReplySelectType;
} {

  return {
    lowerCase: <LowerCaseThreadReplySelectType>threadReplySelectType.toLowerCase(),
    upperCase: <UpperCaseThreadReplySelectType>threadReplySelectType.toUpperCase(),
  };
}
